import { Component, OnInit } from '@angular/core';
import criteria from '../../shared/criteria.json'
import { AssessmentRating } from '../../shared/interfaces/assessment-rating';
import { Teacher } from '../../shared/models/teacher';
import { TeacherService } from '../../shared/services/teacher.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FrequencyRatingEnum } from '../../shared/enum/frequencyRating';
import { Assessment } from '../../shared/models/assessment';
import { Subject } from '../../shared/models/subject';
import { SubjectService } from '../../shared/services/subject.service';
import { AssessmentService } from '../../shared/services/assessment.service';


@Component({
  selector: 'app-assessment-criteria',
  templateUrl: './assessment-criteria.component.html',
  styleUrl: './assessment-criteria.component.scss'
})
export class AssessmentCriteriaComponent implements OnInit {
  ratingRange: Array<string> = Object.keys(FrequencyRatingEnum);
  currentDimension = criteria[0];
  currentDimensionColor =  this.currentDimension.color;
  currentSentence = this.currentDimension.sentences[0];
  currentSentenceRate: number = 0;
  teacher: Teacher =  new Teacher('', '', '');
  subject: Subject = new Subject('', '');
  assessment: Assessment = new Assessment('', '', '', 0, {});

  constructor(
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private assessmentService: AssessmentService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { };

  ngOnInit(): void {
    this.getTeacher();
    this.getSubject();
    this.updateAssessmentParams();
  }

  getTeacher(): void {
    const teacherId = this.activatedRoute.snapshot.params['teacherId'];
    this.teacherService.getById(teacherId).subscribe(
      response => {
        this.teacher = response;
        this.assessment.teacherId = this.teacher.id;
      }
    );
  }

  getSubject(): void {
    const subjectId = this.activatedRoute.snapshot.params['subjectId'];
    this.subjectService.getById(subjectId).subscribe(
      response => {
        this.subject = response;
        this.assessment.subjectId = this.subject.id;
      }
    );
  }

  updateAssessmentParams(): void {
    this.assessment.teacherId = this.teacher.id;
    this.assessment.subjectId = this.subject.id;
    this.assessment.year = parseInt(this.activatedRoute.snapshot.params['year']);
    this.assessment.rating = this.transformCriteriaIntoAssessmentRating();
  }

  transformCriteriaIntoAssessmentRating(): AssessmentRating {
    let assessmentRating: AssessmentRating = {};

    criteria.forEach(item => {
        let dimensionName = item.dimension;
        let dimensionSentences: { [sentence: string]: number } = {};

        item.sentences.forEach(sentence => {
            dimensionSentences[sentence] = 0;
        });

        assessmentRating[dimensionName] = dimensionSentences;
    });

    return assessmentRating;
  }
  

  nextSentence(): void {
    let currentDimensionIndex = criteria.indexOf(this.currentDimension);
    if (currentDimensionIndex !== criteria.length - 1) {
      currentDimensionIndex++;
      this.currentDimension = criteria[currentDimensionIndex];
      this.updateColor();
    } else {
      this.finishAssessment();
    }
  }

  previousSentence(): void {
    let currentDimensionIndex = criteria.indexOf(this.currentDimension);
    if (currentDimensionIndex !== 0) {
      currentDimensionIndex--;
      this.currentDimension = criteria[currentDimensionIndex];
      this.updateColor();
    } else {
      this.goToTeachingSelection();
    }
  }

  updateColor(): void {
    this.currentDimensionColor =  this.currentDimension.color;
  }
  
  getFrequencyByRate(rate: string): string {
    return FrequencyRatingEnum[rate as keyof typeof FrequencyRatingEnum];
  }

  changeCurrentRate(rate: string, sentence: string): void {
    this.assessment.rating[this.currentDimension.dimension][sentence] = parseInt(rate);
    console.log(this.assessment.rating[this.currentDimension.dimension])
  }

  isRateCurrent(rate: string, sentence: string): boolean {
    return parseInt(rate) === this.assessment.rating[this.currentDimension.dimension][sentence];
  }

  isAllRateSelected(): boolean {
    return !Object.values(this.assessment.rating[this.currentDimension.dimension]).some(value => value === 0);
  }

  isLastDimension(): boolean {
    let currentDimensionIndex = criteria.indexOf(this.currentDimension);
    return currentDimensionIndex === criteria.length - 1
  }

  finishAssessment(): void {
    this.assessmentService.create(this.assessment).subscribe();
    this.router.navigate(['/thank-you']);
  }

  goToTeachingSelection(): void {
    this.router.navigate(['/teaching-selection', this.teacher.id]);
  }
}
