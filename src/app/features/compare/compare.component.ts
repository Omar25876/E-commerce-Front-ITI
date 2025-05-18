import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList
} from '@angular/core';
import { CompareService } from '../../services/compare.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from "../../Shared/Components/product-card/product-card.component";
import { Product } from '../../models/productModel';
import { ProductService } from '../../services/product.service';
import { BrandService } from '../../services/brand.service';
import { Brand } from '../../models/brandModel';
import gsap from 'gsap';

@Component({
  selector: 'app-compare',
  imports: [
    FormsModule,
    CommonModule,
    ProductCardComponent
  ],
  providers: [ProductService, BrandService],
  templateUrl: './compare.component.html',
  styles: ``
})
export class CompareComponent implements OnInit, AfterViewInit {
  @ViewChild('pageWrapper') pageWrapper!: ElementRef;
  @ViewChildren('card') cards!: QueryList<ElementRef>;

  productCompare: Product[] = [];
  brands: Brand[] = [];
  products: Product[] = [];
  brandMap = new Map<string, string>();

  constructor(
    private compareprodServ: CompareService,
    private productsrv: ProductService,
    private brandsrv: BrandService
  ) {}

  ngOnInit(): void {
    this.compareprodServ.compareProducts$.subscribe(data => {
      this.productCompare = data;
    });

    this.brandsrv.getAllBrands().subscribe({
      next: (data) => {
        this.brands = data;
        this.brandMap = new Map(data.map(dat => [dat._id, dat.name]));
      }
    });

    this.productsrv.getAllProductsbyFilters().subscribe({
      next: (data) => {
        this.products = data;
      }
    });
  }

  ngAfterViewInit(): void {
    // Animate page
    gsap.from(this.pageWrapper.nativeElement, {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power3.out',
    });

    // Animate product cards
    this.cards.changes.subscribe((cards: QueryList<ElementRef>) => {
      gsap.from(cards.map(card => card.nativeElement), {
        duration: 0.8,
        opacity: 0,
        y: 30,
        stagger: 0.1,
        ease: 'power2.out',
      });
    });

    // Trigger for initial load
    if (this.cards.length > 0) {
      gsap.from(this.cards.map(c => c.nativeElement), {
        duration: 0.6,
        opacity: 0,
        y: 30,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }
  }

  getBrandname(brand: string): string {
    return this.brandMap.get(brand) || 'Unknown Brand';
  }

  getProductColors(id: string): string[] {
    const product = this.products.find(prod => prod._id === id);
    return product?.imagesAndColors ? Object.keys(product.imagesAndColors) : [];
  }

  getType(id: string, key: string): string[] {
    const product = this.products.find(prod => prod._id === id);
    const value = product?.specs?.[key];
    return Array.isArray(value) ? value : [String(value)];
  }

  remove(id: string) {
    this.compareprodServ.removeFromCompare(id);
  }

  clear() {
    // Add exit animation before clearing
    gsap.to(this.cards.map(c => c.nativeElement), {
      opacity: 0,
      y: 40,
      duration: 0.3,
      ease: 'power2.in',
      stagger: 0.05,
      onComplete: () => {
        this.compareprodServ.clearCompare();
      }
    });
  }
}
