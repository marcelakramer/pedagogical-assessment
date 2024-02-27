import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentCriteriaComponent } from './assessment-criteria/assessment-criteria.component';



@NgModule({
  declarations: [
    AssessmentCriteriaComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AssessmentCriteriaComponent
  ]
})
export class AssessmentModule { }
