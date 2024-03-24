import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportViewingComponent } from './report-viewing/report-viewing.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    ReportViewingComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  exports: [
    ReportViewingComponent
  ]
})
export class ReportModule { }
