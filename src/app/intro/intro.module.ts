import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteComponent } from './invite/invite.component';
import { HowItWorkComponent } from './how-it-work/how-it-work.component';



@NgModule({
  declarations: [
    InviteComponent,
    HowItWorkComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    InviteComponent,
    HowItWorkComponent
  ]
})
export class IntroModule { }
