import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherSelectionComponent } from './teacher-selection/teacher-selection.component';
import { FormsModule } from '@angular/forms';
import { TeachingSelectionComponent } from './teaching-selection/teaching-selection.component';



@NgModule({
  declarations: [
    TeacherSelectionComponent,
    TeachingSelectionComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    TeacherSelectionComponent,
    TeachingSelectionComponent
  ]
})
export class TeacherModule { }
