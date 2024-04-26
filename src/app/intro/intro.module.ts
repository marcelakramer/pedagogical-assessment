import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteComponent } from './invite/invite.component';
import { HowItWorkComponent } from './how-it-work/how-it-work.component';
import { IdentificationComponent } from './identification/identification.component';




@NgModule({
  declarations: [
    InviteComponent,
    HowItWorkComponent,
    IdentificationComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    InviteComponent,
    HowItWorkComponent,
    IdentificationComponent
  ]
})
export class IntroModule { }
