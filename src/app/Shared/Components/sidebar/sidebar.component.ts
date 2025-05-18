import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { Category } from '../../../models/categoryModel';
import { Brand } from '../../../models/brandModel';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  providers: [ProductService, CategoryService, BrandService],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit, AfterViewInit {
  @Output() filtersChanged: EventEmitter<any> = new EventEmitter();
  @ViewChild('filterSection') filterSectionRef!: ElementRef;

  categories: Category[] = [];
  brands: Brand[] = [];
  Stars: number[] = [1, 2, 3, 4, 5];

  iscategoryopen = true;
  isbrandopen = true;
  isratingopen = true;
  ispriceopen = true;

  selectedCategories: Category[] = [];
  selectedBrands: Brand[] = [];
  selectedRatings: number[] = [];
  minPrice: any;
  maxPrice: any;

  private priceChange$ = new Subject<void>();
  errorprice: boolean = false;

  get BrandId(): string[] {
    return this.brands.map((brand) => brand._id);
  }

  constructor(
    private categoryService: CategoryService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();

    this.priceChange$.pipe(debounceTime(500)).subscribe(() => {
      this.emitFilters();
    });
  }

  ngAfterViewInit(): void {
    if (this.filterSectionRef) {
      gsap.from(this.filterSectionRef.nativeElement, {
        opacity: 0,
        x: -50,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Error loading categories', err),
    });
  }

  loadBrands() {
    this.brandService.getAllBrands().subscribe({
      next: (data) => {
        this.brands = data;
        console.log(this.BrandId);
      },
      error: (err) => console.error('Error loading brands', err),
    });
  }

  categoryChecked(category: Category): boolean {
    return this.selectedCategories.some((c) => c._id === category._id);
  }

  OnCategoryChange(category: Category, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(
        (item) => item._id !== category._id
      );
    }
    this.emitFilters();
  }

  brandChecked(brand: Brand): boolean {
    return this.selectedBrands.some((b) => b._id === brand._id);
  }

  OnBrandChange(brand: Brand, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedBrands.push(brand);
    } else {
      this.selectedBrands = this.selectedBrands.filter(
        (item) => item._id !== brand._id
      );
    }
    this.emitFilters();
  }

  onRatingChange(rating: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedRatings.push(rating);
    } else {
      this.selectedRatings = this.selectedRatings.filter((r) => r !== rating);
    }
    this.emitFilters();
  }

  onminPriceChange(minPrice: any) {
    const parsedMin = parseFloat(minPrice);
    this.minPrice = !isNaN(parsedMin) && parsedMin >= 0 ? parsedMin : null;
    this.priceChange$.next();
  }

  onmaxPriceChange(maxPrice: any) {
    const parsedMax = parseFloat(maxPrice);
    this.maxPrice = !isNaN(parsedMax) && parsedMax >= 0 ? parsedMax : null;
    this.priceChange$.next();
  }

  emitFilters() {
    if (
      this.minPrice !== null &&
      this.maxPrice !== null &&
      this.minPrice > this.maxPrice
    ) {
      this.errorprice = true;
      return;
    } else {
      this.errorprice = false;
    }

    this.filtersChanged.emit({
      selectedCategories: this.selectedCategories,
      selectedBrands: this.selectedBrands,
      selectedRatings: this.selectedRatings,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
    });
  }
}
