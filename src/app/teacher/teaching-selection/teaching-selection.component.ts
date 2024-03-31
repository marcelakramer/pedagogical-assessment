import { Component, OnInit } from '@angular/core';
import { Subject } from '../../shared/models/subject';
import { Teaching } from '../../shared/models/teaching';
import { Teacher } from '../../shared/models/teacher';
import { TeacherService } from '../../shared/services/teacher/teacher.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TeachingService } from '../../shared/services/teaching/teaching.service';
import { SubjectService } from '../../shared/services/subject/subject.service';

@Component({
  selector: 'app-teaching-selection',
  templateUrl: './teaching-selection.component.html',
  styleUrl: './teaching-selection.component.scss'
})
export class TeachingSelectionComponent implements OnInit {
  teacher: Teacher = new Teacher('', '', '');
  teachings: Array<Teaching> = [];
  selectedSubject: Subject = new Subject('', '');
  availableSubjects: Array<Subject> = [];
  availableYears: Array<number> = [];
  selectedYear: number = 0;

  constructor(
    private teacherService: TeacherService,
    private teachingService: TeachingService,
    private subjectService: SubjectService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getTeacher();
  }

  getTeacher(): void {
    const teacherId = this.activatedRoute.snapshot.params['teacherId'];
    this.teacherService.getById(teacherId).subscribe(
      response => {
        this.teacher = response;
        this.getTeachings();
      }
    );
  }

  getTeachings(): void {
    const teacherId = this.activatedRoute.snapshot.params['teacherId'];
    this.teachingService.getByTeacherId(teacherId).subscribe(
      response => {
        this.teachings = response;
        this.getAvailableSubjects();
      }
    )
  }

  getAvailableSubjects(): void {
    const subjectsIds: Array<string> = this.teachings.map(teaching => teaching.subjectId);
    this.subjectService.getSubjectsByIds(subjectsIds).subscribe(
      response => {
        this.availableSubjects = response;
      }
    );
  }

  selectSubject(eventTarget: EventTarget | null): void {
    if (eventTarget) {
      const object = eventTarget as HTMLSelectElement;
      const selectedSubjectName = object.value;
      this.selectedSubject = this.availableSubjects.find(subject => subject.name === selectedSubjectName)!;
    }
  }

  selectYear(eventTarget: EventTarget | null): void {
    if (eventTarget) {
      const object = eventTarget as HTMLSelectElement;
      this.selectedYear = parseInt(object.value);
    }
  }

  updateYears(): void {
    if (this.selectedSubject) {
      const selectedTeaching = this.teachings.find(teaching => teaching.subjectId === this.selectedSubject.id);
      if (selectedTeaching) {
        this.availableYears = Array.from({ length: selectedTeaching.lastYear - selectedTeaching.firstYear + 1 }, (_, i) => selectedTeaching.firstYear + i).sort((a, b) => b - a);
      }
    } else {
      this.availableYears = [];
    }
  }

  isSubjectSelected(): boolean {
    return this.selectedSubject.id != '';
  }

  isYearSelected(): boolean {
    return this.selectedYear != 0;
  }

  goToTeacherSelection(): void {
    this.router.navigate(['/teacher-selection']);
    window.scrollTo(0, 0);
  }

  goToAssessment() {
    this.router.navigate(['/assessment', this.teacher.id, this.selectedSubject.id, this.selectedYear]);
    window.scrollTo(0, 0);
  }

}

