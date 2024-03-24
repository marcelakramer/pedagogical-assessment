import { Component } from '@angular/core';
import { Teacher } from '../../shared/models/teacher';
import { AssessmentRating } from '../../shared/interfaces/assessment-rating';
import { SpecificsAverages } from '../../shared/interfaces/specifics-averages';
import criteria from '../../shared/criteria.json'
import { TeacherService } from '../../shared/services/teacher.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AverageOptionsEnum } from '../../shared/enum/averageOptions';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { AssessmentService } from '../../shared/services/assessment.service';
import { Assessment } from '../../shared/models/assessment';

@Component({
  selector: 'app-report-viewing',
  templateUrl: './report-viewing.component.html',
  styleUrl: './report-viewing.component.scss'
})
export class ReportViewingComponent {
  mode: ProgressSpinnerMode = 'determinate';
  teacher: Teacher = new Teacher('', '', '');
  assessments: Array<Assessment> = [];
  averageOptionsEnum = AverageOptionsEnum; // type
  averageOptions: Array<string> = Object.values(AverageOptionsEnum);
  selectedAverageOption: string = AverageOptionsEnum.dimensionAverage;
  overallAverage: number = 7.5;
  specificsAverages: Array<SpecificsAverages> = [];

  constructor(
    private teacherService: TeacherService,
    private assessmentService: AssessmentService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { };

  ngOnInit(): void {
    this.getTeacher();
  }

  getTeacher(): void {
    const teacherId = this.activatedRoute.snapshot.params['teacherId'];
    this.teacherService.getById(teacherId).subscribe(
      response => {
        this.teacher = response;
        this.getAssessments();
      }
    );
  }

  getAssessments(): void {
    this.assessmentService.getByTeacherId(this.teacher.id).subscribe(
      response => {
        this.assessments = response;
        this.overallAverage = this.calcOverallAverage(this.assessments);
        this.specificsAverages = this.calcSpecificsAverages(this.assessments);
      }
    )
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

  goToTeacherSelection(): void {
    this.router.navigate(['/teacher-selection']);
  }
  
}
