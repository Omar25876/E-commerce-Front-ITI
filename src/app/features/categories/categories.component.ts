import {
  Component,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import gsap from 'gsap';
import { SlidarComponent } from "./slidar/slidar.component";
import { NewArivallsComponent } from "./new-arivalls/new-arivalls.component";
import { AllComponent } from "./all/all.component";
import { BrandComponent } from "./brand/brand.component";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  standalone: true,
  imports: [
    SlidarComponent,
    NewArivallsComponent,
    AllComponent,
    BrandComponent
  ]
})
export class CategoriesComponent implements OnInit, AfterViewInit {
  @ViewChild('pageWrapper', { static: true }) pageWrapper!: ElementRef;
  @ViewChildren('section') sections!: QueryList<ElementRef>;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Entry animation
    gsap.from(this.pageWrapper.nativeElement, {
      duration: 0.7,
      y: 40,
      opacity: 0.3,
      ease: 'power2.out'
    });

    gsap.from(this.sections.map(el => el.nativeElement), {
      duration: 0.6,
      y: 30,
      opacity: 0,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }

  // Use this method instead of direct navigation
  animateAndNavigate(path: string): void {
    gsap.to(this.pageWrapper.nativeElement, {
      duration: 0.5,
      y: -40,
      opacity: 0,
      ease: 'power3.in',
      onComplete: () => {
        this.router.navigateByUrl(path);
      }
    });
  }
}
