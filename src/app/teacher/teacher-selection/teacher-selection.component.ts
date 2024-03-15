import { Component, OnInit } from '@angular/core';
import { Teacher } from '../../shared/models/teacher';
import { TeacherService } from '../../shared/services/teacher.service';
import { Router } from '@angular/router';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-teacher-selection',
  templateUrl: './teacher-selection.component.html',
  styleUrl: './teacher-selection.component.scss'
})
export class TeacherSelectionComponent implements OnInit {
  teachers: Array<Teacher> = [];
  selectedTeacher!: Teacher;

  constructor(private teacherService: TeacherService, private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.teacherService.getAll().subscribe(
      response => {
        this.teachers = response;
      });
  }

  goToAssessment(): void {
    console.log(this.selectedTeacher)
    // this.dataService.setData()
    this.router.navigate(['/assessment']);
  }

  selectTeacher(eventTarget: EventTarget | null): void {
    if (eventTarget) {
      const object = eventTarget as HTMLSelectElement;
      const selectedTeacherName = object.value;
      this.selectedTeacher = this.teachers.find(teacher => teacher.name === selectedTeacherName)!!;
    }
  }
}
