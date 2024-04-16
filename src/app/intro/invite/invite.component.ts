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
    this.router.navigate(['/how-it-work']);
  }

  goToHome() {
    this.router.navigate(['/']);
    window.scrollTo(0, 0);
  }
}
