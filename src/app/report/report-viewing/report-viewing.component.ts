import { Component } from '@angular/core';
import { Teacher } from '../../shared/models/teacher';
import { AssessmentRating } from '../../shared/interfaces/assessment-rating';
import { SpecificsAverages } from '../../shared/interfaces/specifics-averages';
import criteria from '../../shared/criteria.json'
import { TeacherService } from '../../shared/services/teacher.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-report-viewing',
  templateUrl: './report-viewing.component.html',
  styleUrl: './report-viewing.component.scss'
})
export class ReportViewingComponent {
  teacher!: Teacher;
  overallAverage: number = 0;
  specificsAverages: Array<SpecificsAverages> = [];

  constructor(private teacherService: TeacherService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const teacherId = this.activatedRoute.snapshot.params['teacherId'];
    this.teacherService.getById(teacherId).subscribe(
      response => {
        this.teacher = response;
        this.overallAverage = this.calcOverallAverage(this.teacher.assessments);
        this.specificsAverages = this.calcSpecificsAverages(this.teacher.assessments);
      }
    );
  }

  calcOverallAverage(assessments: Array<AssessmentRating>): number {
    let ratingTotal = 0;
    let criterionsQuantity = 0;

    assessments.forEach(item => {
      Object.values(item).forEach(dimension => {
        Object.values(dimension).forEach(sentenceRate => {
            ratingTotal += sentenceRate;
            criterionsQuantity++;
          });
        });
    });

    const overallAverage = (ratingTotal / criterionsQuantity) * 2;
    return overallAverage;
  }

  calcSpecificsAverages(assessments: Array<AssessmentRating>): Array<SpecificsAverages> {
    const averages: SpecificsAverages[] = [];

    for (const dimension in assessments[0]) {
        let dimensionColor = ''
        criteria.some(item => {
          if (dimension == item.dimension) {
            dimensionColor = item.color;
          }
        })
        const dimensionAverages: number[] = [];
        const sentenceAverages: { sentence: string, average: number }[] = [];

        for (const sentence in assessments[0][dimension]) {
            let total = 0;

            assessments.forEach(assessment => {
                total += assessment[dimension][sentence];
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
