import { Component } from '@angular/core';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    UserPanelComponent,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styles: ''
})
export class NavbarComponent {
  isUserPanelVisible: boolean = false;


  toggleUserPanel(): void {
    this.isUserPanelVisible = !this.isUserPanelVisible;
  }
}
