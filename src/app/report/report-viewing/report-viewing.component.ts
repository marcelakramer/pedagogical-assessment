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
        Object.values(dimension).forEach(criterionRate => {
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

    for (const dimension in assessments[0]) {
        let aspectColor = ''
        criteria.some(item => {
          if (dimension == item.dimension) {
            aspectColor = item.color;
          }
        })
        const aspectAverages: number[] = [];
        const criteriaAverages: { criterion: string, average: number }[] = [];

        for (const criterion in assessments[0][dimension]) {
            let total = 0;

            assessments.forEach(assessment => {
                total += assessment[dimension][criterion];
            });

            criteriaAverages.push({ criterion, average: total / assessments.length });
            aspectAverages.push(total / assessments.length);
        }

        const aspectAverage = aspectAverages.reduce((acc, curr) => acc + curr, 0) / aspectAverages.length;

        averages.push({
            dimension,
            aspectColor,
            average: aspectAverage,
            criteriaAverage: criteriaAverages
        });
    }
    return averages;
  }

  goToTeacherSelection(): void {
    this.router.navigate(['/teacher-selection']);
  }
  
}
