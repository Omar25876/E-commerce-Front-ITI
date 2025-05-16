import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private URL = 'http://localhost:5000/api';

  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor(
    private myHTTPClient: HttpClient,
    private router: Router,
    private storage: StorageService
  ) {
    // Check login status on service init
    const token = this.getToken();
    this._isLoggedIn.next(!!token && !this.isTokenExpired());
  }

  // Register User
  registerUser(userData: any) {
    return this.myHTTPClient.post(`${this.URL}/register`, userData);
  }

  // Login User
  loginUser(userData: any): Observable<any> {
    return this.myHTTPClient.post(`${this.URL}/login`, userData).pipe(
      tap((res: any) => {
        if (res.token) {
          this._isLoggedIn.next(true);
          this.saveToken(res.token);
          this.saveUserData(res.user);
        } else {
          this._isLoggedIn.next(false);
          throw new Error('Invalid login response: token missing.');
        }
      }),
      catchError((err) => {
        this._isLoggedIn.next(false);
        return throwError(() => err);
      })
    );
  }

  // Save Token to Local Storage
  saveToken(token: string): void {
    this.storage.setItem('token', token);
  }

  // Get Token from Local Storage
  getToken(): string | null {
    return this.storage.getItem<string>('token');
  }

  // Remove Token from Local Storage
  removeToken(): void {
    this.storage.removeItem('token');
  }

  // Check if Token is Expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const exp = new Date(0);
      exp.setUTCSeconds(decoded.exp);
      return exp < new Date();
    } catch (e) {
      console.error('Invalid token:', e);
      return true;
    }
  }

  // Manual Login Check (Optional)
  isLoggedIn(): boolean {
    return !!this.getToken() && !this.isTokenExpired();
  }

  // Logout User
  logout(): void {
    this.removeToken();
    this.removeUserData();
    this._isLoggedIn.next(false);
    this.router.navigateByUrl('/auth/login');
  }

  // Save User Data
  saveUserData(userData: any): void {
    this.storage.setItem('user', userData);
  }

  getUserData(): any {
    return this.storage.getItem<any>('user');
  }

  removeUserData(): void {
    this.storage.removeItem('user');
  }

  getUserRole(): string | null {
    const data = this.getUserData();
    return data ? data.role : null;
  }
}
