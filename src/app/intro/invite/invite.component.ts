import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrl: './invite.component.scss'
})
export class InviteComponent {

  constructor(private router: Router) { }

  goToHowItWork() {
    this.router.navigate(['/how']);
    window.scrollTo(0, 0);
  }

  goToIdentification() {
    this.router.navigate(['/identification']);
    window.scrollTo(0, 0);
  }
}
