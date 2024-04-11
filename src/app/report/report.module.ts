import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportViewingComponent } from './report-viewing/report-viewing.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ModalModule } from '../modal/modal.module';



@NgModule({
  declarations: [
    ReportViewingComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    ModalModule
  ],
  exports: [
    ReportViewingComponent
  ]
})
export class ReportModule { }
