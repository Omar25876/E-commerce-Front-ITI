import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ProductSec1Component } from "./product-sec1/product-sec1.component";
import { ProductSec2Component } from "./product-sec2/product-sec2.component";
import { ProductSec3Component } from "./product-sec3/product-sec3.component";
import { HttpClientModule } from '@angular/common/http';
import { gsap } from 'gsap';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ProductSec1Component, ProductSec2Component, ProductSec3Component, HttpClientModule],
  templateUrl: './product.component.html',
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductComponent implements AfterViewInit {
  @ViewChild('productContainer', { static: false }) productContainer!: ElementRef<HTMLElement>;

  constructor() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngAfterViewInit() {
    const sectionElements = Array.from(this.productContainer.nativeElement.children);

    gsap.from(sectionElements, {
      opacity: 0,
      y: 50,
      duration: 0.6,
      stagger: 0.2,
      ease: 'power3.out'
    });
  }
}
