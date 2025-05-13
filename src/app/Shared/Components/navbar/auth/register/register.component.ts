import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../services/auth.service';

@Component({
  selector: 'app-register',
  providers: [AuthService],
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.component.html',
  styles: '',
})
export class RegisterComponent {
  constructor(private myService: AuthService, private router: Router) {}

  passwordMismatch: boolean = false;
  showPassword = false;
  showConfirmPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  myForm = new FormGroup({
    firstName: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z]+$/),
    ]),
    lastName: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z]+$/),
    ]),
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/(?=.*[A-Z])$/)
    ]),
    confirmPassword: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    phone: new FormControl<string | null>(null, [
      Validators.required,
      Validators.pattern('^(010|011|012|015)[0-9]{8}$'),
    ]),
    gender: new FormControl<string | null>(null, [Validators.required]),
  });

  checkPasswordMatch() {
    const password = this.myForm.get('password')?.value;
    const confirmPassword = this.myForm.get('confirmPassword')?.value;
    this.passwordMismatch = password !== confirmPassword;
  }
  onSubmit(): void {
    if (this.myForm.valid) {
      (this.myForm as FormGroup).removeControl('confirmPassword');
      console.log(this.myForm.value);
      this.myService.registerUser(this.myForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          console.error(err);
        },
      });
      console.log('Form Submitted', this.myForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
