import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private URL = 'http://localhost:5000/api';

  constructor(
    private myHTTPClient: HttpClient,
    private router: Router,
    private storage: StorageService
  ) {}

  // Register User
  registerUser(userData: any) {
    return this.myHTTPClient.post(`${this.URL}/register`, userData);
  }

  // Login User
  loginUser(userData: any) {
    return this.myHTTPClient.post(`${this.URL}/login`, userData);
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

  // Check if User is Logged In
  isLoggedIn(): boolean {
    return !this.isTokenExpired();
  }

  // Logout User
  logout(): void {
    this.removeToken();
    this.removeUserData();
    this.router.navigateByUrl('/auth/login');
  }

  // Check if Token is Expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
      const expDate = new Date(0);
      expDate.setUTCSeconds(decodedToken.exp); // Extract expiration date

      return expDate < new Date(); // Check if the token is expired
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }

  // Save User Data to Local Storage
  saveUserData(userData: any): void {
    this.storage.setItem('userData', userData);
  }

  // Get User Data from Local Storage
  getUserData(): any {
    return this.storage.getItem<any>('userData');
  }

  // Remove User Data from Local Storage
  removeUserData(): void {
    this.storage.removeItem('userData');
  }

  // Get User Role
  getUserRole(): string | null {
    const userData = this.getUserData();
    return userData ? userData.role : null;
  }
}
