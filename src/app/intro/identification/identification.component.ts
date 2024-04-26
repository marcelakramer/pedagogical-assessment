import { Component } from '@angular/core';
import { UserTypesEnum } from '../../shared/enum/userTypes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-identification',
  templateUrl: './identification.component.html',
  styleUrls: ['./identification.component.scss']
})
export class IdentificationComponent {
  userTypesEnum = UserTypesEnum;
  selectedUserType: string = '';

  constructor(private router: Router) { }

  getUserTypes(): (keyof typeof UserTypesEnum)[] {
    return Object.keys(this.userTypesEnum) as (keyof typeof UserTypesEnum)[];
  }

  selectUserType(userType: keyof typeof UserTypesEnum): void {
    this.selectedUserType = this.userTypesEnum[userType];
  }

  isUserTypeSelected(userType: keyof typeof UserTypesEnum): boolean {
    return this.selectedUserType === this.userTypesEnum[userType];
  }

  isAnyUserTypeSelected(): boolean {
    return Object.keys(this.userTypesEnum).some(key => this.userTypesEnum[key as keyof typeof UserTypesEnum] === this.selectedUserType);
  }

  goToNextPage(): void {
    switch(this.selectedUserType) {
      case this.userTypesEnum.admin:
        this.router.navigate(['/auth']);
        break

      case this.userTypesEnum.student:
        this.router.navigate(['/invite']);
        break
    }
    window.scrollTo(0, 0);
  }

  goToHome(): void {
    this.router.navigate(['/']);
    window.scrollTo(0, 0);
  }
}
