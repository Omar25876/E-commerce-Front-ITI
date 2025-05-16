import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from '../../../../../../services/auth.service';
import { MessageService } from '../../../../../../services/message.service';
import { ImageService } from '../../../../../../services/image.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login-form.component.html',
  styles: ``,
})
export class LoginFormComponent {
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private msgService: MessageService,
    private imageService: ImageService
  ) {}

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

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.myForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    const { email, password } = this.myForm.value;

    if (!email || !password) {
      console.error('Missing email or password');
      return;
    }

    // Clear previous session
    this.authService.removeToken();
    this.authService.removeUserData();

    // Call login API
    this.authService.loginUser({ email, password }).subscribe({
      next: (res: any) => {
        if (res.token && res.user) {
          this.authService.saveToken(res.token);
          this.authService.saveUserData(res.user);
          this.imageService.setImageUrl(res.user.profileImageUrl);
          this.msgService.show(
            `Welcome back ${res.user.firstName} ${res.user.lastName}, great to see you again!`
          );

          const route = res.user.isAdmin ? '/admin' : '/dashboard';
          this.router.navigate([route]);
        } else {
          console.error('Login failed: No token or user returned');
        }
      },
      error: (err) => {
        console.error('Login error:', err);
      },
    });
  }
}
