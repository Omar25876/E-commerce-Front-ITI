import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import gsap from 'gsap';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './auth.component.html',
  styles: ``
})
export class AuthComponent implements AfterViewInit {
  @ViewChild('authWrapper', { static: true }) authWrapper!: ElementRef;

  ngAfterViewInit(): void {
    gsap.from(this.authWrapper.nativeElement, {
      duration: 1,
      opacity: 0.3,
      y: 50,
      ease: 'power2.out'
    });
  }
}
