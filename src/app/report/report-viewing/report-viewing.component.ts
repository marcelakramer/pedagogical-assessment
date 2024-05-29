import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Teacher } from '../../shared/models/teacher';
import { SpecificsAverages } from '../../shared/interfaces/specifics-averages';
import criteria from '../../shared/criteria.json';
import { ActivatedRoute, Router } from '@angular/router';
import { AverageOptionsEnum } from '../../shared/enum/averageOptions';
import { Assessment } from '../../shared/models/assessment';
import { OverallAverageStatusEnum } from '../../shared/enum/overallAverageStatus';
import { OverallAverageColorEnum } from '../../shared/enum/overallAverageColor';
import { ModalService } from '../../shared/services/modal/modal.service';
import { Filter } from '../../shared/interfaces/filter';
import { Subject } from '../../shared/models/subject';
import { Teaching } from '../../shared/models/teaching';
import { TeacherFirestoreService } from '../../shared/services/teacher/teacher-firestore.service';
import { TeachingFirestoreService } from '../../shared/services/teaching/teaching-firestore.service';
import { SubjectFirestoreService } from '../../shared/services/subject/subject-firestore.service';
import { AssessmentFirestoreService } from '../../shared/services/assessment/assessment-firestore.service';

@Component({
  selector: 'app-report-viewing',
  templateUrl: './report-viewing.component.html',
  styleUrl: './report-viewing.component.scss'
})
export class ReportViewingComponent implements OnInit {
  teacher: Teacher = new Teacher('', '', '');
  teachings: Array<Teaching> = [];
  assessments: Array<Assessment> = [];
  averageOptionsEnum: typeof AverageOptionsEnum = AverageOptionsEnum;
  averageOptions: Array<string> = Object.values(AverageOptionsEnum);
  selectedAverageOption: string = AverageOptionsEnum.overallAverage;
  overallAverage: number = 0;
  overallStatus: string = "";
  overallColor: string = "";
  specificsStatusWarning = OverallAverageStatusEnum.intervention;
  specificsStatusWarningColor = OverallAverageColorEnum.intervention;
  specificsAverages: Array<SpecificsAverages> = [];
  selectedSpecificAverage: SpecificsAverages = {"average": 0, "dimension": '', "dimensionColor": '', "sentenceAverage": []};
  filteredAssessments: Array<Assessment> = [...this.assessments];
  filterSelected: Filter = {subject: undefined, year: undefined};
  filterApplied: Filter = {subject: undefined, year: undefined};
  subjects: Array<Subject> = [];
  filteredSubjects: Array<Subject> = [];
  years: Array<number> = [];
  filteredYears: Array<number> = [];
  @ViewChild('dimensionSelect') dimensionSelect?: ElementRef;
  @ViewChild('subjectFilterSelect') subjectFilterSelect?: ElementRef;
  @ViewChild('yearFilterSelect') yearFilterSelect?: ElementRef;
  isLoading: boolean = true;
  
  constructor(
    private teacherService: TeacherFirestoreService,
    private teachingService: TeachingFirestoreService,
    private subjectService: SubjectFirestoreService,
    private assessmentService: AssessmentFirestoreService,
    private modalService: ModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getTeacher();
  }

  getTeacher = (): void => {
    const teacherId = this.activatedRoute.snapshot.params['teacherId'];
    this.teacherService.getById(teacherId).subscribe(response => {
      this.teacher = response;
      this.getAssessments();
      this.getTeachings();
      this.isLoading = false;
    });
  };

  getAssessments = (): void => {
    this.assessmentService.getByTeacherId(this.teacher.id).subscribe(response => {
      this.assessments = response;
      this.filteredAssessments = this.assessments;
      this.overallAverage = this.calcOverallAverage(this.assessments);
      this.updateOverallStatus();
      this.specificsAverages = this.calcSpecificsAverages(this.assessments);
      this.orderSpecificsAverages();
      this.selectedSpecificAverage = this.specificsAverages[0];
    });
  };

  getTeachings = (): void => {
    this.teachingService.getByTeacherId(this.teacher.id).subscribe(response => {
      this.teachings = response;
      this.getSubjects();
      this.getYears();
    });
  };

  getSubjects = (): void => {
    const subjectsIds = this.teachings.map(teaching => teaching.subjectId);
    this.subjectService.getManyByIds(subjectsIds).subscribe(response => {
      this.subjects = response;
      this.filteredSubjects = this.subjects;
    });
  };

  getYears = (): void => {
    const yearsSet = new Set<number>();
    this.teachings.forEach(({ firstYear, lastYear }) => {
      for (let year = firstYear; year <= lastYear; year++) {
        yearsSet.add(year);
      }
    });
    this.years = Array.from(yearsSet).sort((a, b) => a - b);
    this.filteredYears = this.years;
  };

  calcOverallAverage = (assessments: Assessment[]): number => {
    let ratingTotal = 0;
    let criterionsQuantity = 0;

    assessments.forEach(item => {
      Object.values(item.rating).forEach(dimension => {
        Object.values(dimension).forEach(sentenceRate => {
          ratingTotal += sentenceRate;
          criterionsQuantity++;
        });
      });
    });
      
    return (ratingTotal / criterionsQuantity) * 2;
  };
    
  updateOverallStatus = (): void => {
    if (this.overallAverage < 6) {
      this.overallStatus = OverallAverageStatusEnum.intervention;
    } else {
      this.overallStatus = OverallAverageStatusEnum.fit;
    }
    this.updateOverallColor();
  };

  updateOverallColor = (): void => {
    switch(this.overallStatus) {
      case OverallAverageStatusEnum.fit:
        this.overallColor = OverallAverageColorEnum.fit;
        break;
      case OverallAverageStatusEnum.intervention:
        this.overallColor = OverallAverageColorEnum.intervention;
        break;
    }
  };

  calcSpecificsAverages(assessments: Array<Assessment>): Array<SpecificsAverages> {
    const averages: SpecificsAverages[] = [];
    
    if (this.hasAssessments()) {
      for (const dimension in assessments[0].rating) {
        let dimensionColor = ''
        criteria.some(item => {
          if (dimension == item.dimension) {
            dimensionColor = item.color;
          }
        })
        const dimensionAverages: number[] = [];
        const sentenceAverages: { sentence: string, average: number }[] = [];
        
        for (const sentence in assessments[0].rating[dimension]) {
          let total = 0;
          
          assessments.forEach(assessment => {
            total += assessment.rating[dimension][sentence];
          });
          
          sentenceAverages.push({ sentence: sentence, average: (total / assessments.length) * 2 });
          dimensionAverages.push(total / assessments.length);
        }
        
        const aspectAverage = dimensionAverages.reduce((acc, curr) => acc + curr, 0) / dimensionAverages.length * 2;
        
        averages.push({
          dimension,
          dimensionColor: dimensionColor,
          average: aspectAverage,
          sentenceAverage: sentenceAverages
        });
      }
    }
    return averages;
  }

  orderSpecificsAverages = (): void => {
    const criteriaOrderMap = new Map<string, number>();
    criteria.forEach((criterion, index) => {
      criteriaOrderMap.set(criterion.dimension, index);
    });
  
    this.specificsAverages.sort((a, b) => {
      const orderA = criteriaOrderMap.get(a.dimension);
      const orderB = criteriaOrderMap.get(b.dimension);

      if (orderA === undefined && orderB === undefined) {
        return a.dimension.localeCompare(b.dimension);
      } else if (orderA === undefined) {
        return 1;
      } else if (orderB === undefined) {
        return -1;
      }
  
      return orderA - orderB;
    });

    this.specificsAverages.forEach(specific => {
      specific.sentenceAverage.sort((a, b) => {
        return a.average - b.average;
      });
    });
  };

  hasAssessments = () => {
    return this.assessments.length > 0;
  }

  selectAverageOption = (eventTarget: EventTarget | null): void => {
    if (eventTarget) {
      const object = eventTarget as HTMLSelectElement;
      this.selectedAverageOption = object.value;
      if (this.selectedAverageOption === this.averageOptionsEnum.sentenceAverage) {
        this.selectedSpecificAverage = this.specificsAverages[0];
      } 
    }
  }

  selectSpecificAverage = (eventTarget: EventTarget | null): void => {
    if (eventTarget) {
      const object = eventTarget as HTMLSelectElement;
      const selectedDimension = object.value;
      this.selectedSpecificAverage = this.specificsAverages.find(specificAverage => specificAverage.dimension === selectedDimension)!;
    } 
  };

  hasWarningDimension = (): boolean => {
    return this.specificsAverages.some(dimension => dimension.average < 6);
  }

  hasWarningSentence = (): boolean => {
    return this.selectedSpecificAverage.sentenceAverage.some(sentence => sentence.average < 6);
  }


  openFilterModal = (): void => {
    this.modalService.open('filter-modal');
    this.filterSelected.subject = this.filterApplied.subject;
    this.filterSelected.year = this.filterApplied.year;
    this.updateFilterModalFields();
  };

  closeModal = (): void => {
    this.modalService.close();
  };

  updateFilterModalFields = (): void => {
    const subjectFilterSelectElement = this.subjectFilterSelect?.nativeElement;
    if (subjectFilterSelectElement) {
      const index = this.filteredSubjects.findIndex(subject => subject.id === this.filterSelected.subject?.id);
      subjectFilterSelectElement.selectedIndex = index + 1;
    }

    const yearFilterSelectElement = this.yearFilterSelect?.nativeElement;
    if (yearFilterSelectElement) {
      const index = this.filteredYears.findIndex(year => year === this.filterSelected.year);
      yearFilterSelectElement.selectedIndex = index + 1;
    }
  };

  selectSubjectToFilter = (eventTarget: EventTarget | null): void => {
    if (eventTarget) {
      const object = eventTarget as HTMLSelectElement;
      const selectedSubject = object.value;
      this.filterSelected.subject = this.subjects.find(subject => subject.name === selectedSubject);
    }
  };

  selectYearToFilter = (eventTarget: EventTarget | null): void => {
    if (eventTarget) {
      const object = eventTarget as HTMLSelectElement;
      this.filterSelected.year = isNaN(+object.value) ? undefined : +object.value;
    }
  };

  applyFilters = (): void => {
    this.filterApplied.subject = this.filterSelected.subject;
    this.filterApplied.year = this.filterSelected.year;

    this.filteredAssessments = this.assessments.filter(assessment => {
      return (this.filterApplied.subject === undefined || assessment.subjectId === this.filterApplied.subject.id) &&
             (this.filterApplied.year === undefined || assessment.referenceYear === this.filterApplied.year);
    });

    if (this.filteredAssessments.length !== 0) {
      this.overallAverage = this.calcOverallAverage(this.filteredAssessments);
      this.updateOverallStatus();
      this.specificsAverages = this.calcSpecificsAverages(this.filteredAssessments);
      this.orderSpecificsAverages();
      this.selectedSpecificAverage = this.specificsAverages.find(specificsAverage => specificsAverage.dimension === this.selectedSpecificAverage.dimension)!;
      this.changeDimensionInSelect();
      this.closeModal();
    } else {
      this.closeModal();
      this.modalService.open("filter-error-modal");
      this.removeFilters();
    }
  };

  removeFilters = (): void => {
    this.filterSelected.subject = undefined;
    this.filterApplied.subject = undefined;
    this.filteredSubjects = this.subjects;
    this.filterSelected.year = undefined;
    this.filterApplied.year = undefined;
    this.filteredYears = this.years;
    this.clearFilterSelectFields();
    this.resetAverages();
  };

  clearFilterSelectFields = (): void => {
    const subjectFilterSelectElement = this.subjectFilterSelect?.nativeElement;
    subjectFilterSelectElement.selectedIndex = 0;
    const yearFilterSelectElement = this.yearFilterSelect?.nativeElement;
    yearFilterSelectElement.selectedIndex = 0;
  };

  resetAverages = (): void => {
    this.filteredAssessments = this.assessments;
    this.overallAverage = this.calcOverallAverage(this.assessments);
    this.updateOverallStatus();
    this.specificsAverages = this.calcSpecificsAverages(this.assessments);
    this.selectedSpecificAverage = this.specificsAverages.find(specificsAverage => specificsAverage.dimension === this.selectedSpecificAverage.dimension)!;
    this.changeDimensionInSelect();
  };

  changeDimensionInSelect = (): void => {
    const index = this.specificsAverages.findIndex(specificAverage =>
        specificAverage.dimension === this.selectedSpecificAverage.dimension
    );
    
    const dimensionSelectElement = this.dimensionSelect?.nativeElement;
    if (dimensionSelectElement !== undefined && index !== -1) {
        setTimeout(() => {
            dimensionSelectElement.selectedIndex = index;
        });
    }
  }
  
  isFilterSelected = (): boolean => {
    return this.filterApplied.subject !== undefined || this.filterApplied.year !== undefined;
  };

  goToTeacherSelection = (): void => {
    this.router.navigate(['/teacher/admin']);
    window.scrollTo(0, 0);
  };
}
