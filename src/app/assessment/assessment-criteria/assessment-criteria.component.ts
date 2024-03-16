import { Component, OnInit } from '@angular/core';
import criteria from '../../shared/criteria.json'
import { AssessmentRating } from '../../shared/interfaces/assessment-rating';
import { Teacher } from '../../shared/models/teacher';
import { TeacherService } from '../../shared/services/teacher.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-assessment-criteria',
  templateUrl: './assessment-criteria.component.html',
  styleUrl: './assessment-criteria.component.scss'
})
export class AssessmentCriteriaComponent implements OnInit {
  ratingRange: Array<string> = ['1','2','3','4','5','6','7','8','9','10'];
  currentCriteriaRate: number = 0;
  currentAspect = criteria[0];
  currentAspectColor =  this.currentAspect.color;
  currentCriteria = this.currentAspect.criteria[0];
  assessment: AssessmentRating = this.transformCriteriaIntoAssessmentRating();
  teacher!: Teacher;

  constructor(private teacherService: TeacherService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const teacherId = this.activatedRoute.snapshot.params['teacherId'];
    this.teacherService.getById(teacherId).subscribe(
      response => {
        this.teacher = response;
      }
    );
  }

  transformCriteriaIntoAssessmentRating(): AssessmentRating {
    let assessment: AssessmentRating = {};

    criteria.forEach(item => {
        let aspectName = item.aspect;
        let aspectCriteria: { [criterionName: string]: number } = {};

        item.criteria.forEach(criterion => {
            aspectCriteria[criterion.criterion] = 0;
        });

        assessment[aspectName] = aspectCriteria;
    });

    return assessment;
  }
  

  nextCriteria(): void {
    this.assessment[this.currentAspect.aspect][this.currentCriteria.criterion] = this.currentCriteriaRate;
    let currentAspectIndex = criteria.indexOf(this.currentAspect);
    const currentCriteriaIndex = criteria[currentAspectIndex].criteria.indexOf(this.currentCriteria);
    if (currentCriteriaIndex === this.currentAspect.criteria.length - 1) {
      if (currentAspectIndex !== criteria.length - 1) {
        currentAspectIndex++;
        this.currentAspect = criteria[currentAspectIndex];
        this.currentCriteria = criteria[currentAspectIndex].criteria[0];
        this.updateColor();
      } else {
        this.finishAssessment();
      }
    } else {
      this.currentCriteria = criteria[currentAspectIndex].criteria[currentCriteriaIndex + 1];
    }
    if (this.assessment[this.currentAspect.aspect][this.currentCriteria.criterion] !== 0) {
      this.currentCriteriaRate = this.assessment[this.currentAspect.aspect][this.currentCriteria.criterion]
    } else {
      this.currentCriteriaRate = 0
    }
  }

  previousCriteria(): void {
    let currentAspectIndex = criteria.indexOf(this.currentAspect);
    const currentCriteriaIndex = criteria[currentAspectIndex].criteria.indexOf(this.currentCriteria);
    if (currentCriteriaIndex === 0) {
      if (currentAspectIndex !== 0) {
        currentAspectIndex--;
        this.currentAspect = criteria[currentAspectIndex];
        this.currentCriteria = criteria[currentAspectIndex].criteria[criteria[currentAspectIndex].criteria.length - 1];
        this.updateColor();
      } else {
        this.goToTeacherSelection();
      }
    } else {
      this.currentCriteria = criteria[currentAspectIndex].criteria[currentCriteriaIndex - 1];
    }
    this.currentCriteriaRate = this.assessment[this.currentAspect.aspect][this.currentCriteria.criterion];
  }

  updateColor(): void {
    this.currentAspectColor =  this.currentAspect.color;
  }

  changeCurrentRate(rate: string): void {
    if (this.isRateCurrent(rate)) {
      this.currentCriteriaRate = 0;
    } else {
      this.currentCriteriaRate = parseInt(rate);
    }
  }

  isRateCurrent(rate: string): boolean {
    return parseInt(rate) === this.currentCriteriaRate;
  }

  isAnyRateSelected(): boolean {
    return this.currentCriteriaRate !== 0;
  }

  finishAssessment(): void {
    this.teacher.assessments.push(this.assessment);
    this.teacherService.update(this.teacher).subscribe();
    this.router.navigate(['/']);
  }

  goToTeacherSelection(): void {
    this.router.navigate(['/teacher-selection']);
  }
}
