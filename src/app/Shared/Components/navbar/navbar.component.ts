import { ChangeDetectorRef, Component, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../../../models/userModel';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  providers:[AuthService],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './navbar.component.html',
  styles: ''
})
export class NavbarComponent {
  islogin: boolean = false;
  dropdownOpen: boolean = false;
  user: User = {
    _id: '',
    profileImageUrl: '',
    firstName: '',
    lastName: '',
    email: '',
    address: {
      city: '',
      street: '',
      buildingNumber: '',
      apartmentNumber: '',
    },
    phone: '',
    gender: 'male',
    isAdmin: true,
    createdAt: '',
    updatedAt: '',
  };
 searchTerm: string = '';

  constructor(private myService: AuthService, private router: Router,private cdRef: ChangeDetectorRef,) {
    this.islogin = this.myService.isLoggedIn();
    console.log(this.islogin);
    this.user = this.myService.getUserData();
    console.log(this.user);
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  sign(): void {
    this.router.navigate(['/auth/login']);
  }

  viewProfile(): void {
    this.dropdownOpen = !this.dropdownOpen;
    this.router.navigate(['/dashboard']);

  }

  logout(): void {
    this.dropdownOpen = !this.dropdownOpen;
    this.myService.logout(); // Perform logout logic
    this.cdRef.detectChanges();
  }

  OnSearchChange(query: string): void {
    this.searchTerm = query;
    console.log(this.searchTerm);
  }


}
