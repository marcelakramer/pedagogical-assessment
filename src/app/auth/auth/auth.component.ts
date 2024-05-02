import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '../../shared/services/modal/modal.service';
import { UserTypesEnum } from '../../shared/enum/userTypes';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
  userType: string = '';
  isAdmin: boolean = false;
  form: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
      const routeUserType = this.activatedRoute.snapshot.params['userType'];
      
      if (routeUserType === 'admin') {
        this.userType = UserTypesEnum.admin;
        this.isAdmin = true;
      } else if (routeUserType === 'student') {
        this.userType = UserTypesEnum.student;
      }
      this.checkCredentials();
  }

  authenticate(): void {
    let authentication = false;
    if (this.isAdmin) {
      authentication = this.authService.validateAdminCredentials(this.form.value.username, this.form.value.password);
    } else {
      authentication = this.authService.validateStudentCredentials(this.form.value.username, this.form.value.password);
    }

    if (authentication) {
      this.modalService.open('auth-success-modal')
    } else {
      this.modalService.open('auth-fail-modal');
      this.form.reset();
    }
  }

  checkCredentials(): void {
    if (this.isAdmin) {
      if (this.authService.validateSessionCredentials()) {
        this.goToTeacherSelection();
      }
    } else {
      if (this.authService.hasStudentLogged()) {
        this.goToInvite();
      }
    }
  }

  goToTeacherSelection(): void {
    this.router.navigate(['/teacher/admin']);
  }

  goToInvite(): void {
    this.router.navigate(['/invite']);
  }

  goToIdentification(): void {
    this.router.navigate(['/identification']);
  }

  closeModal(): void {
    this.modalService.close();
  }

  closeAndGoToNextPage(): void {
    this.closeModal();
    if (this.isAdmin) {
      this.goToTeacherSelection();
    } else {
      this.goToInvite();
    }
  }

}
