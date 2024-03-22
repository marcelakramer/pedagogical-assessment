import { Component, OnInit } from '@angular/core';
import { Teacher } from '../../shared/models/teacher';
import { TeacherService } from '../../shared/services/teacher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-selection',
  templateUrl: './teacher-selection.component.html',
  styleUrl: './teacher-selection.component.scss'
})
export class TeacherSelectionComponent implements OnInit {
  teachers: Array<Teacher> = [];
  selectedTeacher!: Teacher;

  constructor(private teacherService: TeacherService, private router: Router) { }

  ngOnInit(): void {
    this.teacherService.getAll().subscribe(
      response => {
        this.teachers = response;
      });
  }

  goToTeachingSelection(): void {
    this.router.navigate(['/teaching-selection', this.selectedTeacher.id]);
  }

  goToReport(): void {
    this.router.navigate(['/report', this.selectedTeacher.id]);
  }

  selectTeacher(eventTarget: EventTarget | null): void {
    if (eventTarget) {
      const object = eventTarget as HTMLSelectElement;
      const selectedTeacherName = object.value;
      this.selectedTeacher = this.teachers.find(teacher => teacher.name === selectedTeacherName)!!;
    }
  }

  isTeacherSelected(): boolean {
    return this.selectedTeacher != null;
  }
}
