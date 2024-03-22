import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherSelectionComponent } from './teacher/teacher-selection/teacher-selection.component';
import { AssessmentCriteriaComponent } from './assessment/assessment-criteria/assessment-criteria.component';
import { ReportViewingComponent } from './report/report-viewing/report-viewing.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { ThankYouPageComponent } from './thank-you/thank-you-page/thank-you-page.component';
import { TeachingSelectionComponent } from './teacher/teaching-selection/teaching-selection.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'teacher-selection', component: TeacherSelectionComponent },
  { path: 'teaching-selection/:teacherId', component: TeachingSelectionComponent },
  { path: 'assessment/:teacherId/:subjectId/:year', component: AssessmentCriteriaComponent },
  { path: 'report/:teacherId', component: ReportViewingComponent },
  { path: 'thank-you', component: ThankYouPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
