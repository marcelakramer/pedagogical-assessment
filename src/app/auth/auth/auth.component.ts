import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from '../../shared/services/modal/modal.service';


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

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: ModalService
  ) { }

  authenticate(): void {
    if (this.authService.validateAdminCredentials(this.form.value.username, this.form.value.password)) {
      this.modalService.open('auth-success-modal');
    } else {
      this.modalService.open('auth-fail-modal');
      this.form.reset();
    }
  }

  goToTeacherSelection(): void {
    this.router.navigate(['/teacher']);
  }

  closeModal(): void {
    this.modalService.close();
  }

  closeAndGoToTeacherSelection(): void {
    this.closeModal();
    this.goToTeacherSelection();
  }

}
