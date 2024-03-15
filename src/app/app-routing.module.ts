import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherSelectionComponent } from './teacher/teacher-selection/teacher-selection.component';
import { AssessmentCriteriaComponent } from './assessment/assessment-criteria/assessment-criteria.component';
import { ReportViewingComponent } from './report/report-viewing/report-viewing.component';

const routes: Routes = [
  { path: '', component: TeacherSelectionComponent },
  // { path: 'teacher-selection', component: TeacherSelectionComponent },
  { path: 'assessment/:teacherId', component: AssessmentCriteriaComponent },
  { path: 'report', component: ReportViewingComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
