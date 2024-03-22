import { Component } from '@angular/core';
import { Subject } from '../../shared/models/subject';
import { Teaching } from '../../shared/models/teaching';
import { Teacher } from '../../shared/models/teacher';
import { TeacherService } from '../../shared/services/teacher.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-teaching-selection',
  templateUrl: './teaching-selection.component.html',
  styleUrl: './teaching-selection.component.scss'
})
export class TeachingSelectionComponent {
  teachings: Array<Teaching> = [
    new Teaching('1', new Teacher('', '', '',[], []), new Subject('', 'abalo'), 2000, 2020),
    new Teaching('2', new Teacher('', '', '',[], []), new Subject('', 'abalo2'), 2005, 2025)
  ];
  selectedSubject!: Subject;
  availableYears: Array<number> = [];
  selectedYear!: number;

  constructor(private teacherService: TeacherService, private router: Router, private activatedRoute: ActivatedRoute) { }

  selectSubject(eventTarget: EventTarget | null): void {
    if (eventTarget) {
      const object = eventTarget as HTMLSelectElement;
      const selectedSubjectName = object.value;
      this.selectedSubject = this.teachings.find(teaching => teaching.subject.name === selectedSubjectName)!.subject;
    }
  }

  updateYears(): void {
    if (this.selectedSubject) {
      const selectedTeaching = this.teachings.find(teaching => teaching.subject === this.selectedSubject);
      console.log(selectedTeaching)
      if (selectedTeaching) {
        this.availableYears = Array.from({ length: selectedTeaching.lastYear - selectedTeaching.firstYear + 1 }, (_, i) => selectedTeaching.firstYear + i).sort((a, b) => b - a);;
      }
    } else {
      this.availableYears = [];
    }
    console.log(this.availableYears)
  }

  isSubjectSelected(): boolean {
    return this.selectSubject != null;
  }

  goToAssessment() {
    this.router.navigate(['/assessment', 1, 1, 2024])
  }

}

