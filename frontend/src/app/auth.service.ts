import {computed, Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _username = signal('');
  private _password = signal('');
  private _isAdmin = signal(false);

  readonly isAdmin = computed(() => this._isAdmin());

  login(username: string, password: string) {
    this._username.set(username);
    this._password.set(password);
    this._isAdmin.set(true); // oppure fare fetch per validare login
  }

  logout() {
    this._username.set('');
    this._password.set('');
    this._isAdmin.set(false);
  }

  getAuthHeaders(): HeadersInit {

    console.log("username", this._username())
    console.log("username", this._password())
    if (!this._username() || !this._password()) {
      throw new Error('AuthService: username/password non settati');
    }

    return {
      'Authorization': 'Basic ' + btoa(`${this._username()}:${this._password()}`)
    };
  }
}
