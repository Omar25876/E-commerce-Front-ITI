import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  providers:[AuthService],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './navbar.component.html',
  styles: ''
})
export class NavbarComponent {
  islogin: boolean = false;
  isMobileMenuOpen: boolean = false;

  constructor(private myService: AuthService, private router: Router) {
    this.islogin = this.myService.isLoggedIn();
  }

  sign(): void {
    this.router.navigate(['/auth/login']);
  }

  viewProfile(): void {
    this.router.navigate(['/dashboard']);
  }


}
