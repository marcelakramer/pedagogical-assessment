import { Component } from '@angular/core';
import criteria from '../../shared/criteria.json'
import { AssessmentRating } from '../../shared/interfaces/aspect';

@Component({
  selector: 'app-assessment-criteria',
  templateUrl: './assessment-criteria.component.html',
  styleUrl: './assessment-criteria.component.scss'
})
export class AssessmentCriteriaComponent {
  ratingRange: Array<string> = ['1','2','3','4','5','6','7','8','9','10'];
  currentCriteriaRate: number = 0;
  selectedAspect = criteria[0];
  selectedAspectColor =  this.selectedAspect.color;
  selectedCriteria = this.selectedAspect.criteria[0];
  assessment: AssessmentRating = this.transformCriteriaIntoAssessmentRating();


  transformCriteriaIntoAssessmentRating(): AssessmentRating {
    let assessment: AssessmentRating = {};

    criteria.forEach(item => {
        let aspectName = item.aspect;
        let aspectCriteria: { [criterionName: string]: number } = {};

        item.criteria.forEach(criterion => {
            aspectCriteria[criterion.name] = 0;
        });

        assessment[aspectName] = aspectCriteria;
    });

    return assessment;
  }
  

  nextCriteria(): void {
    this.assessment[this.selectedAspect.aspect][this.selectedCriteria.name] = this.currentCriteriaRate;
    this.currentCriteriaRate = 0;
    let selectedAspectIndex = criteria.indexOf(this.selectedAspect);
    const selectedCriteriaIndex = criteria[selectedAspectIndex].criteria.indexOf(this.selectedCriteria);
    if (selectedCriteriaIndex === this.selectedAspect.criteria.length - 1) {
      if (selectedAspectIndex !== criteria.length - 1) {
        selectedAspectIndex++;
        this.selectedAspect = criteria[selectedAspectIndex];
        this.selectedCriteria = criteria[selectedAspectIndex].criteria[0];
        this.updateColor();
      } else {
        // finish the assessment
      }
    } else {
      this.selectedCriteria = criteria[selectedAspectIndex].criteria[selectedCriteriaIndex + 1];
    }
  }

  previousCriteria(): void {
    let selectedAspectIndex = criteria.indexOf(this.selectedAspect);
    const selectedCriteriaIndex = criteria[selectedAspectIndex].criteria.indexOf(this.selectedCriteria);
    if (selectedCriteriaIndex === 0) {
      if (selectedAspectIndex !== 0) {
        selectedAspectIndex--;
        this.selectedAspect = criteria[selectedAspectIndex];
        this.selectedCriteria = criteria[selectedAspectIndex].criteria[criteria[selectedAspectIndex].criteria.length - 1];
        this.updateColor();
      } else {
        // back to main page
      }
    } else {
      this.selectedCriteria = criteria[selectedAspectIndex].criteria[selectedCriteriaIndex - 1];
    }
    this.currentCriteriaRate = this.assessment[this.selectedAspect.aspect][this.selectedCriteria.name];
  }

  updateColor(): void {
    this.selectedAspectColor =  this.selectedAspect.color;
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
}
