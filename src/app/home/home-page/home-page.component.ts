import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

  constructor(private router: Router) { }

  goToInvite(): void {
    this.router.navigate(['/invite']);
    window.scrollTo(0, 0);
  }
}
