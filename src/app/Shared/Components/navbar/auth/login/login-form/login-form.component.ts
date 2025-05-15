import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../../../services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MessageService } from '../../../../../../services/message.service';

@Component({
  selector: 'app-login-form',
  providers: [AuthService],
  imports: [RouterModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login-form.component.html',
  styles: ``
})
export class LoginFormComponent {
  showPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  constructor(private authService: AuthService, private router: Router ,private MsgSer:MessageService) {}

  myForm = new FormGroup({
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  onSubmit(): void {

    if (this.myForm.valid) {
      const { email, password } = this.myForm.value;
      this.authService.removeToken();
      // Call the login API
      this.authService.loginUser({ email, password }).subscribe({
        next: (res: any) => {
          if (res.token) {
            // Save the token and navigate to the dashboard
            this.authService.saveToken(res.token);
            this.authService.saveUserData(res.user);
            
            if(this.authService.getUserData().isAdmin)
              this.router.navigate(['/admin']);
            else
              this.router.navigate(['/dashboard']);
            
            this.MsgSer.show(`Welcome Back ${res.user.firstName} ${res.user.lastName} , Great to See You Again.`)
          } else {
            console.error('No token received');
          }
        },
        error: (err) => {
          console.error('Login failed', err);
        },
      });

      // console.log('Form Submitted', this.myForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
