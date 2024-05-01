import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  ADMIN_USERNAME: string = environment.ADMIN_USERNAME;
  ADMIN_PASSWORD: string = environment.ADMIN_PASSWORD;

  validateAdminCredentials(username: string, password: string): boolean {
    if (username === this.ADMIN_USERNAME && password === this.ADMIN_PASSWORD) {
      sessionStorage.setItem('session', JSON.stringify({username: this.ADMIN_USERNAME, password: this.ADMIN_PASSWORD}));
      return true
    }
    return false
  }

  getSessionCredentials(): object | void {
    const sessionCredentials = sessionStorage.getItem('session');
    if (sessionCredentials) return JSON.parse(sessionCredentials);
  }

  validateSessionCredentials(): boolean {
    const credentials = this.getSessionCredentials() as { username: string, password: string } | undefined;
    if (credentials && 'username' in credentials && 'password' in credentials) {
        return this.validateAdminCredentials(credentials.username, credentials.password);
    }
    return false;
  }
}
