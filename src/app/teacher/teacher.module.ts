import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherSelectionComponent } from './teacher-selection/teacher-selection.component';



@NgModule({
  declarations: [
    TeacherSelectionComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TeacherSelectionComponent
  ]
})
export class TeacherModule { }
