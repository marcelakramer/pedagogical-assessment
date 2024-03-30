import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thank-you-page',
  templateUrl: './thank-you-page.component.html',
  styleUrl: './thank-you-page.component.scss'
})
export class ThankYouPageComponent {

  constructor(private router: Router) { }

  goToHome(): void {
    this.router.navigate(['/']);
    window.scrollTo(0, 0);
  }
}
