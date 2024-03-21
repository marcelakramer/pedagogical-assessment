import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentCriteriaComponent } from './assessment-criteria/assessment-criteria.component';
import {  MatTooltipModule } from '@angular/material/tooltip';




@NgModule({
  declarations: [
    AssessmentCriteriaComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule
  ],
  exports: [
    AssessmentCriteriaComponent
  ]
})
export class AssessmentModule { }
