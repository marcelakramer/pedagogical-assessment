import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  form: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) { }

  authenticate(): void {
    if (this.authService.validateAdminCredentials(this.form.value.username, this.form.value.password)) {
      alert('sucesso')
      this.goToTeacherSelection();
    } else {
      alert('erro')
    }
  }

  goToTeacherSelection(): void {
    this.router.navigate(['/teacher-selection'])
  }

}
