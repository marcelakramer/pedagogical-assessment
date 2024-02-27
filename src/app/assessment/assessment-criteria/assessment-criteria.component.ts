import { Component } from '@angular/core';
import criteria from '../../shared/criteria.json'

@Component({
  selector: 'app-assessment-criteria',
  templateUrl: './assessment-criteria.component.html',
  styleUrl: './assessment-criteria.component.scss'
})
export class AssessmentCriteriaComponent {
  ratingRange: Array<string> = ['1','2','3','4','5','6','7','8','9','10'];
  currentRate: string = '';
  criteria: Array<{}> = criteria;
  selectedAspect = criteria[0];
  selectedAspectColor =  this.selectedAspect.color;
  selectedCriteria = this.selectedAspect.criteria[0];
  

  nextCriteria(): void {
    // save rate
    this.currentRate = '';
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
    console.log(selectedCriteriaIndex)
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
  }

  updateColor(): void {
    this.selectedAspectColor =  this.selectedAspect.color;
  }

  changeCurrentRate(rate: string): void {
    this.currentRate = rate;
  }

  isRateCurrent(rate: string): boolean {
    return rate === this.currentRate;
  }
}
