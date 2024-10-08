import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TeacherModule } from './teacher/teacher.module';
import { AssessmentModule } from './assessment/assessment.module';
import { ReportModule } from './report/report.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HomeModule } from './home/home.module';
import { ThankYouModule } from './thank-you/thank-you.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthModule } from './auth/auth.module';
import { ModalModule } from './modal/modal.module';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { IntroModule } from './intro/intro.module';
import { FirebaseModule } from './firebase/firebase.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TeacherModule,
    AssessmentModule,
    ReportModule,
    HomeModule,
    ThankYouModule,
    HttpClientModule,
    AuthModule,
    ModalModule,
    IntroModule,
    FirebaseModule
  ],
  providers: [
    provideAnimationsAsync(),
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
