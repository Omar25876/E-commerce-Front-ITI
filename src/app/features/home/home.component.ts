import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HomeSec1Component } from './home-sec1/home-sec1.component';
import { HomeSec2Component } from './home-sec2/home-sec2.component';
import { HomeSec3Component } from './home-sec3/home-sec3.component';
import { HomeSec4Component } from './home-sec4/home-sec4.component';
import { HomeSec5Component } from "./home-sec5/home-sec5.component";
import gsap from 'gsap';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HomeSec1Component,
    HomeSec2Component,
    HomeSec3Component,
    HomeSec4Component,
    HomeSec5Component
  ],
  templateUrl: './home.component.html',
  styles: ''
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('pageWrapper', { static: true }) pageWrapper!: ElementRef;
  @ViewChildren('sectionWrapper') sections!: QueryList<ElementRef>;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    gsap.from(this.pageWrapper.nativeElement, {
      duration: 0.7,
      y: 40,
      opacity: 0.3,
      ease: 'power2.out'
    });
    const elements = this.sections.map(el => el.nativeElement);
    gsap.from(elements, {
      y: 50,
      opacity: 0.3,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }
}
