import { Component } from '@angular/core';
import { Teacher } from '../../shared/models/teacher';
import { AssessmentRating } from '../../shared/interfaces/assessment-rating';
import { assessments } from '../../shared/assessments';
import { SpecificsAverages } from '../../shared/interfaces/specifics-averages';

@Component({
  selector: 'app-report-viewing',
  templateUrl: './report-viewing.component.html',
  styleUrl: './report-viewing.component.scss'
})
export class ReportViewingComponent {
  teacher: Teacher = new Teacher('1', '130089', 'Alecsandro Monteiro Kramer', assessments)
  overallAverage: number = this.calcOverallAverage(this.teacher.assessments)
  specificsAverages: Array<SpecificsAverages> = this.calcSpecificsAverages(this.teacher.assessments);

  calcOverallAverage(assessments: Array<AssessmentRating>): number {
    let ratingTotal = 0;
    let criterionsQuantity = 0;

    assessments.forEach(item => {
      Object.values(item).forEach(aspect => {
        Object.values(aspect).forEach(criterionRate => {
            ratingTotal += criterionRate;
            criterionsQuantity++;
          });
        });
    });

    const overallAverage = ratingTotal / criterionsQuantity;
    return overallAverage;
  }

  calcSpecificsAverages(assessments: Array<AssessmentRating>): Array<SpecificsAverages> {
    const averages: SpecificsAverages[] = [];

    for (const aspect in assessments[0]) {
        const aspectAverages: number[] = [];
        const criteriaAverages: { criterion: string, average: number }[] = [];

        for (const criterion in assessments[0][aspect]) {
            let total = 0;

  
            assessments.forEach(assessment => {
                total += assessment[aspect][criterion];
            });

            criteriaAverages.push({ criterion, average: total / assessments.length });
            aspectAverages.push(total / assessments.length);
        }

        const aspectAverage = aspectAverages.reduce((acc, curr) => acc + curr, 0) / aspectAverages.length;

        averages.push({
            aspect,
            average: aspectAverage,
            criteriaAverage: criteriaAverages
        });
    }
    return averages;
  }
}
