import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../../services/auth.service';
import { MessageService } from '../../../../../services/message.service';
import gsap from 'gsap';

@Component({
  selector: 'app-register',
  providers: [AuthService],
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.component.html',
  styles: '',
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild('registerWrapper', { static: true }) registerWrapper!: ElementRef;

  constructor(
    private myService: AuthService,
    private router: Router,
    private MsgSer: MessageService
  ) {}

  passwordMismatch: boolean = false;
  showPassword = false;
  showConfirmPassword = false;

  ngAfterViewInit(): void {
    gsap.from(this.registerWrapper.nativeElement, {
      duration: 1,
      opacity: 0.3,
      y: 50,
      ease: 'power3.out'
    });
  }

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
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
      ),
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
      this.myService.registerUser(this.myForm.value).subscribe({
        next: (res) => {
          this.router.navigate(['/auth/login']);
          this.MsgSer.show('Registration Completed. Now you can log in.');
        },
        error: (err) => {
          this.MsgSer.show(err.message);
        },
      });
    }
  }
}
