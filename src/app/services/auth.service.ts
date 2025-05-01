import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/userModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private URL = 'http://localhost:5000/api';

  constructor(private myHTTPClient: HttpClient, private router: Router) {}

  // Register User
  registerUser(userData: any) {
    return this.myHTTPClient.post(`${this.URL}/register`, userData);
  }

  // Login User
  loginUser(userData: any):Observable<LoginResponse>{
    return this.myHTTPClient.post<LoginResponse>(`${this.URL}/login`, userData);
  }

  // Save Token to Local Storage
  saveToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('userToken', token);
    }
  }

  // Get Token from Local Storage
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('userToken');
    }
    return null;
  }

  // Remove Token from Local Storage
  removeToken(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('userToken');
    }
  }

  // Check if User is Logged In
  isLoggedIn(): boolean {
    return !this.isTokenExpired();
  }

  // Logout User
  logout(): void {
    localStorage.removeItem('userToken');
    this.router.navigate(['/auth/login']);
  }

  // Check if Token is Expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expDate = new Date(0);
      expDate.setUTCSeconds(decodedToken.exp);

      return expDate < new Date();
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }

  saveUserData(userData: any): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }

  getUserData(): any {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  removeUserData(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('userData');
    }
  }
  getUserRole(): string | null {
    const userData = this.getUserData();
    return userData ? userData.role : null;
  }

}
