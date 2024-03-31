import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  admin: {username: string, password: string} = {
    username: 'admin',
    password: '123'
  }

  validateAdminCredentials(username: string, password: string): boolean {
    if (username === this.admin.username && password === this.admin.password) {
      sessionStorage.setItem('session', JSON.stringify(this.admin));
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
