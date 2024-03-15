import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherSelectionComponent } from './teacher-selection/teacher-selection.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TeacherSelectionComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    TeacherSelectionComponent
  ]
})
export class TeacherModule { }
