import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserPanelComponent } from './user-panel/user-panel.component';

@Component({
  selector: 'app-navbar',
  imports: [
    LoginComponent,
    RegisterComponent,
    UserPanelComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
