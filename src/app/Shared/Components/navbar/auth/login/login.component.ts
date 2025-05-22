import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import gsap from 'gsap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './login.component.html',
  styles: ''
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('loginWrapper', { static: true }) loginWrapper!: ElementRef;

  ngAfterViewInit(): void {
    gsap.from(this.loginWrapper.nativeElement, {
      opacity: 0.3,
      y: 50,
      duration: 1,
      ease: 'power2.out'
    });
  }
}
