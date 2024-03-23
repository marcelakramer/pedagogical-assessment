import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportViewingComponent } from './report-viewing/report-viewing.component';



@NgModule({
  declarations: [
    ReportViewingComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReportViewingComponent
  ]
})
export class ReportModule { }
