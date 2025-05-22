import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../../services/auth.interceptor';
import { gsap } from 'gsap';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, HttpClientModule],
  providers: [
    AccountService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements AfterViewInit {
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('content') content!: ElementRef;

  ngAfterViewInit(): void {
    gsap.from(this.sidebar.nativeElement, {
      x: -200,
      opacity: 0.2,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from(this.content.nativeElement, {
      opacity: 0.2,
      y: 50,
      delay: 0.4,
      duration: 0.8,
      ease: 'power2.out'
    });
  }
}
