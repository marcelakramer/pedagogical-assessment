import { Component } from '@angular/core';
import { Teacher } from '../../shared/models/teacher';
import { TeacherService } from '../../shared/services/teacher.service';

@Component({
  selector: 'app-teacher-selection',
  templateUrl: './teacher-selection.component.html',
  styleUrl: './teacher-selection.component.scss'
})
export class TeacherSelectionComponent {
  teachers: Array<Teacher> = [];

  constructor(teacherService: TeacherService) {
    teacherService.getAll().subscribe(
      response => {
        this.teachers = response;
      }
    )}
}
