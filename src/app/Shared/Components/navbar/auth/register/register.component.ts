import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-register',

  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styles: '',
})
export class RegisterComponent {
  passwordMismatch: boolean = false;
  myForm = new FormGroup(
    {
      firstName: new FormControl<string | null>(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      lastName: new FormControl<string | null>(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      email: new FormControl<string | null>(null, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl<string | null>(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl<string | null>(null, [
        Validators.required,
      ]),
      phone: new FormControl<string | null>(null, [
        Validators.required,
        Validators.pattern('^(010|011|012|015)[0-9]{8}$'),
      ]),
      gender: new FormControl<string | null>(null, [
        Validators.required,
      ]),
    },

  );


  checkPasswordMatch() {
    const password = this.myForm.get('password')?.value;
    const confirmPassword = this.myForm.get('confirmPassword')?.value;
    this.passwordMismatch = password !== confirmPassword;
  }
  onSubmit(): void {
    if (this.myForm.valid) {
      console.log('Form Submitted', this.myForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
