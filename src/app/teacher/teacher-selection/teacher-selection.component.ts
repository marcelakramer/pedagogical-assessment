import { Component, OnInit } from '@angular/core';
import { Teacher } from '../../shared/models/teacher';
import { TeacherService } from '../../shared/services/teacher/teacher.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-teacher-selection',
  templateUrl: './teacher-selection.component.html',
  styleUrl: './teacher-selection.component.scss'
})
export class TeacherSelectionComponent implements OnInit {
  teachers: Array<Teacher> = [];
  selectedTeacher: Teacher = new Teacher('', '', '');
  isAdmin: boolean = false;

  constructor(private teacherService: TeacherService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.teacherService.getAll().subscribe(
      response => {
        this.teachers = response;
      });
    
    this.isAdmin = this.activatedRoute.snapshot.routeConfig?.path === "teacher/admin";
  }

  goToIdentification(): void {
    this.router.navigate(['/identification']);
  }

  goToHowItWork(): void {
    this.router.navigate(['/how']);
  }

  goToTeachingSelection(): void {
    this.router.navigate(['/teaching', this.selectedTeacher.id]);
    window.scrollTo(0, 0);
  }

  goToReport(): void {
    this.router.navigate(['/report', this.selectedTeacher.id]);
    window.scrollTo(0, 0);
  }

  goBack(): void {
    if(this.isAdmin) {
      this.goToIdentification();
    } else {
      this.goToHowItWork();
    }
  }

  selectTeacher(eventTarget: EventTarget | null): void {
    if (eventTarget) {
      const object = eventTarget as HTMLSelectElement;
      const selectedTeacherName = object.value;
      this.selectedTeacher = this.teachers.find(teacher => teacher.name === selectedTeacherName)!;
    }
  }

  isTeacherSelected(): boolean {
    return this.selectedTeacher.id != '';
  }
}
