import { Component, OnInit } from '@angular/core';
import { Subject } from '../../shared/models/subject';
import { Teaching } from '../../shared/models/teaching';
import { Teacher } from '../../shared/models/teacher';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService } from '../../shared/services/subject/subject.service';
import { TeacherFirestoreService } from '../../shared/services/teacher/teacher-firestore.service';
import { TeachingFirestoreService } from '../../shared/services/teaching/teaching-firestore.service';

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
    private teacherService: TeacherFirestoreService,
    private teachingService: TeachingFirestoreService,
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
      const selectedTeachings = this.teachings.filter(teaching => teaching.subjectId === this.selectedSubject.id);
      if (selectedTeachings.length > 0) {
        const years = selectedTeachings.reduce((acc, teaching) => {
          const teachingYears = Array.from({ length: teaching.lastYear - teaching.firstYear + 1 }, (_, i) => teaching.firstYear + i);
          return acc.concat(teachingYears);
        }, [] as number[]);
        
        this.availableYears = Array.from(new Set(years)).sort((a, b) => b - a);
      } else {
        this.availableYears = [];
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
    this.router.navigate(['/teacher']);
    window.scrollTo(0, 0);
  }

  goToAssessment() {
    this.router.navigate(['/assessment', this.teacher.id, this.selectedSubject.id, this.selectedYear]);
    window.scrollTo(0, 0);
  }

}

