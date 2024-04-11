import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Teacher } from '../../shared/models/teacher';
import { SpecificsAverages } from '../../shared/interfaces/specifics-averages';
import criteria from '../../shared/criteria.json'
import { TeacherService } from '../../shared/services/teacher/teacher.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AverageOptionsEnum } from '../../shared/enum/averageOptions';
import { AssessmentService } from '../../shared/services/assessment/assessment.service';
import { Assessment } from '../../shared/models/assessment';
import { OverallAverageStatusEnum } from '../../shared/enum/overallAverageStatus';
import { OverallAverageColorEnum } from '../../shared/enum/overallAverageColor';
import { ModalService } from '../../shared/services/modal/modal.service';
import { Filter } from '../../shared/interfaces/filter';
import { TeachingService } from '../../shared/services/teaching/teaching.service';
import { Teaching } from '../../shared/models/teaching';
import { SubjectService } from '../../shared/services/subject/subject.service';
import { Subject } from '../../shared/models/subject';

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
  specificsAverages: Array<SpecificsAverages> = [];
  selectedSpecificAverage: SpecificsAverages = {"average": 0, "dimension": '', "dimensionColor": '', "sentenceAverage": []};
  filteredAssessments: Array<Assessment> = this.assessments;
  filterSelected: Filter = {subject: undefined, year: undefined};
  subjects: Array<Subject> = [];
  filteredSubjects: Array<Subject> = [];
  years: Array<number> = [];
  filteredYears: Array<number> = [];
  @ViewChild('subjectFilterSelect') subjectFilterSelect?: ElementRef;
  @ViewChild('yearFilterSelect') yearFilterSelect?: ElementRef;
  
  constructor(
    private teacherService: TeacherService,
    private teachingService: TeachingService,
    private subjectService: SubjectService,
    private assessmentService: AssessmentService,
    private modalService: ModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getTeacher();
  }

  getTeacher(): void {
    const teacherId = this.activatedRoute.snapshot.params['teacherId'];
    this.teacherService.getById(teacherId).subscribe(
      response => {
        this.teacher = response;
        this.getAssessments();
        this.getTeachings();
      }
    );
  }

  getAssessments(): void {
    this.assessmentService.getByTeacherId(this.teacher.id).subscribe(
      response => {
        this.assessments = response;
        this.filteredAssessments = this.assessments;
        this.overallAverage = this.calcOverallAverage(this.assessments);
        this.updateOverallStatus();
        this.specificsAverages = this.calcSpecificsAverages(this.assessments);
        this.selectedSpecificAverage = this.specificsAverages[0];
      }
    )
  }

  getTeachings(): void {
    this.teachingService.getByTeacherId(this.teacher.id).subscribe(
      response => {
        this.teachings = response;
        this.getSubjects();
        this.getYears();
      }
    )
  }

  getSubjects(): void {
    const subjectsIds: Array<string> = this.teachings.map(teaching => teaching.subjectId);
    this.subjectService.getSubjectsByIds(subjectsIds).subscribe(
      response => {
        this.subjects = response;
        this.filteredSubjects = this.subjects;
      }
    );
  }

  getYears(): void {
    const yearsSet = new Set<number>();
    for (const teaching of this.teachings) {
        const { firstYear, lastYear } = teaching;
        for (let year = firstYear; year <= lastYear; year++) {
            yearsSet.add(year);
        }
    }
    this.years = Array.from(yearsSet).sort((a, b) => a - b);
    this.filteredYears = this.years;
  }

  selectAverageOption(eventTarget: EventTarget | null): void {
    if (eventTarget) {
      const object = eventTarget as HTMLSelectElement;
      this.selectedAverageOption = object.value;
    }
  }

  calcOverallAverage(assessments: Array<Assessment>): number {
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

    const overallAverage = (ratingTotal / criterionsQuantity) * 2;
    return overallAverage;
  }

  updateOverallStatus(): void {
    if (this.overallAverage >= 7) {
      this.overallStatus = OverallAverageStatusEnum.fit;
    } else if (this.overallAverage > 4) {
      this.overallStatus = OverallAverageStatusEnum.monitoring;
    } else {
      this.overallStatus = OverallAverageStatusEnum.intervention;
    }
    this.updateOverallColor();
  }

  updateOverallColor(): void {
    switch(this.overallStatus) {
      case OverallAverageStatusEnum.fit:
        this.overallColor = OverallAverageColorEnum.fit;
        break

      case OverallAverageStatusEnum.monitoring:
        this.overallColor = OverallAverageColorEnum.monitoring;
        break
      
      case OverallAverageStatusEnum.intervention:
        this.overallColor = OverallAverageColorEnum.intervention
    }
  }

  calcSpecificsAverages(assessments: Array<Assessment>): Array<SpecificsAverages> {
    const averages: SpecificsAverages[] = [];

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
    return averages;
  }

  selectSpecificAverage(eventTarget: EventTarget | null): void {
    if (eventTarget) {
      const object = eventTarget as HTMLSelectElement;
      const selectedDimension = object.value;
      this.selectedSpecificAverage = this.specificsAverages.find(specificAverage => specificAverage.dimension === selectedDimension)!;
    } 
  }

  openFilterModal(): void {
    this.modalService.open('filter-modal');
  }

  closeModal(): void {
    this.modalService.close();
  }

  selectSubjectToFilter(eventTarget: EventTarget | null): void {
    if (eventTarget) {
      const object = eventTarget as HTMLSelectElement;
      const selectedSubject = object.value;
      this.filterSelected.subject = this.subjects.find(subject => subject.name === selectedSubject);
    }
    this.updateYears();
  }

  updateYears(): void {
    if (this.filterSelected.subject !== undefined) {
      const selectedTeaching = this.teachings.find(teaching => teaching.subjectId === this.filterSelected.subject!.id);
      if (selectedTeaching) {
        this.filteredYears = Array.from({ length: selectedTeaching.lastYear - selectedTeaching.firstYear + 1 }, (_, i) => selectedTeaching.firstYear + i).sort((a, b) => b - a);
      }
    } else {
      this.filteredYears = this.years;
    }
  }

  selectYearToFilter(eventTarget: EventTarget | null): void {
    if (eventTarget) {
      const object = eventTarget as HTMLSelectElement;
      this.filterSelected.year = isNaN(+object.value) ? undefined : +object.value;
    }
    this.updateSubjects();
  }

  updateSubjects(): void {
    if (this.filterSelected.year !== undefined) {
      const subjectIds: string[] = [];
      for (const teaching of this.teachings) {
          if (this.filterSelected.year >= teaching.firstYear && this.filterSelected.year <= teaching.lastYear) {
              subjectIds.push(teaching.subjectId);
          }
      }
      this.filteredSubjects = this.subjects.filter(subject => subjectIds.includes(subject.id));
    } else {
      this.filteredSubjects = this.subjects;
    }
  }

  applyFilters(): void {
    if (this.filterSelected.subject === undefined && this.filterSelected.year === undefined) {
      this.closeModal();
      return
    } else if (this.filterSelected.year !== undefined) {
      const filteredSubjectIds: string[] = this.filteredSubjects.map(subject => subject.id);
      this.filteredAssessments = this.assessments.filter(assessment => filteredSubjectIds.includes(assessment.subjectId) && assessment.year === this.filterSelected.year);
    } else if (this.filterSelected.subject !== undefined) {
      this.filteredAssessments = this.assessments.filter(assessment => assessment.subjectId === this.filterSelected.subject?.id && this.filteredYears.includes(assessment.year));
    } else {
      this.filteredAssessments = this.assessments.filter(assessment => assessment.subjectId === this.filterSelected.subject?.id && assessment.year === this.filterSelected.year);
    }
    if (this.filteredAssessments.length !== 0) {
      this.overallAverage = this.calcOverallAverage(this.filteredAssessments);
      this.updateOverallStatus();
      this.specificsAverages = this.calcSpecificsAverages(this.filteredAssessments);
      this.selectedSpecificAverage = this.specificsAverages.find(specificsAverage => specificsAverage.dimension === this.selectedSpecificAverage.dimension)!;
      this.closeModal();
    } else {
      this.closeModal();
      this.modalService.open("filter-error-modal");
      this.removeFilters();
    }
  }

  removeFilters(): void {
    this.filterSelected.subject = undefined;
    this.filteredSubjects = this.subjects;
    this.filterSelected.year = undefined;
    this.filteredYears = this.years;
    this.clearFilterSelectFields();
    this.resetAverages();
  }

  clearFilterSelectFields(): void {
    const subjectFilterSelectElement = this.subjectFilterSelect?.nativeElement;
    subjectFilterSelectElement.selectedIndex = 0;
    const yearFilterSelectElement = this.yearFilterSelect?.nativeElement;
    yearFilterSelectElement.selectedIndex = 0;
  }

  resetAverages(): void {
    this.filteredAssessments = this.assessments;
    this.overallAverage = this.calcOverallAverage(this.assessments);
    this.updateOverallStatus();
    this.specificsAverages = this.calcSpecificsAverages(this.assessments);
    this.selectedSpecificAverage = this.specificsAverages.find(specificsAverage => specificsAverage.dimension === this.selectedSpecificAverage.dimension)!;
  }
  
  isFilterSelected(): boolean {
    return this.filterSelected.subject !== undefined || this.filterSelected.year !== undefined;
  }

  goToTeacherSelection(): void {
    this.router.navigate(['/teacher']);
    window.scrollTo(0, 0);
  }
  
}
