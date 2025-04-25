import { Component } from '@angular/core';
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [RouterModule, RouterOutlet],
  templateUrl: './auth.component.html',
  styles: ``
})
export class AuthComponent {

}
