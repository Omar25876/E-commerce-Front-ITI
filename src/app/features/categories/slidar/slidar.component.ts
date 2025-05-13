import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as noUiSlider from 'nouislider';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-slidar',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './slidar.component.html',
  styles: [``],
})
export class SlidarComponent implements OnInit, OnDestroy, AfterViewInit {
  Images = [
    'Images/Cat-Page/Slider/Banner-1.png',
    'Images/Cat-Page/Slider/Banner-2.png',
    'Images/Cat-Page/Slider/Banner-3.png',
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

  private isUpdated = false;

  ngOnInit(): void {
    if (this.isBrowser) {
      this.startSliding();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser && this.sliderRef?.nativeElement) {
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
          min: 0,
          max: this.Images.length - 1,
        },
        step: 1,
      });

      this.sliderInstance.on('update', (values: any) => {
        const index = Math.round(values[0]);
        this.goToSlide(index);
      });
    }
  }

  startSliding(): void {
    this.stop(); // مهم جدًا لمنع التكرار
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.Images.length;
    this.restartSlider();
  }

  prevSlide(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.Images.length) % this.Images.length;
    this.restartSlider();
  }

  restartSlider(): void {
    this.stop();
    this.isUpdated = true;
    this.updateNoUISlider();
    this.isUpdated = false;
    this.startSliding();
  }

  goToSlide(index: number): void {
    if (this.isUpdated) return;
    this.currentIndex = index;
    this.restartSlider();
  }

  updateNoUISlider(): void {
    if (this.sliderInstance?.set) {
      this.sliderInstance.set(this.currentIndex);
    }
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
