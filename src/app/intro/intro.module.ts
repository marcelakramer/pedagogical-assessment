import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteComponent } from './invite/invite.component';



@NgModule({
  declarations: [
    InviteComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    InviteComponent
  ]
})
export class IntroModule { }
