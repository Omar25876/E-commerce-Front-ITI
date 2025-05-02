import { Component, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as noUiSlider from 'nouislider';

@Component({
  selector: 'app-slidar',
  imports: [CommonModule, FormsModule],
  templateUrl: './slidar.component.html',
  styles: [''],
})
export class SlidarComponent implements OnInit, OnDestroy, AfterViewInit {
  Images = [
    'Images/Cat-Page/Slider/Banner-1.png',
    'Images/Cat-Page/Slider/Banner-2.png',
    'Images/Cat-Page/Slider/Banner-3.png'
  ];
  
  hoveredButton: 'prev' | 'next' | null = null;
  currentIndex = 0;
  interval: any;
  sliderInstance: any = null;
  isBrowser: boolean;

  @ViewChild('sliderRef', { static: false }) sliderRef!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.startSliding();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser && this.sliderRef) {
      this.initializeSlider();
    }
  }

  initializeSlider(): void {
    const sliderElement = this.sliderRef.nativeElement;

    if (!this.sliderInstance) {
      this.sliderInstance = noUiSlider.create(sliderElement, {
        start: [this.currentIndex],
        connect: [true, false],
        range: {
          'min': 0,
          'max': this.Images.length - 1
        },
        step: 1
      });

      this.sliderInstance.on('update', (values: any) => {
        const index = Math.round(values[0]);
        this.goToSlide(index);
      });
    }
  }

  startSliding() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 2000);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.Images.length;
    this.restartSlider();
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.Images.length) % this.Images.length;
    this.restartSlider();
  }

  restartSlider() {
    this.updateNoUISlider();
    // clearInterval(this.interval);
    this.startSliding();

  }

  stop() {
    clearInterval(this.interval);
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.restartSlider();
  }

  updateNoUISlider(): void {
    if (this.sliderInstance) {
      this.sliderInstance.set(this.currentIndex);
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
