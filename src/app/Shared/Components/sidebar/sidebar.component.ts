import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
import e from 'express';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  providers: [ProductService, CategoryService, BrandService],  
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {

  @Output() filtersChanged: EventEmitter<any> = new EventEmitter();

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
  get BrandId() : string[] {
    return this.brands.map((brand) => brand._id);
  }
  constructor(
    private categoryService: CategoryService,
    private brandService: BrandService
  ) { }

  ngOnInit(): void {
    // Load categories and brands on component initialization
    this.loadCategories();
    this.loadBrands();

    // Listen to price changes
    this.priceChange$.pipe(debounceTime(500)).subscribe(() => {
      this.emitFilters();
    });
  }

  // Load categories from the service
  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories', error);
      }
    });
  }

  // Load brands from the service
  loadBrands() {
    this.brandService.getAllBrands().subscribe({
      next: (data) => {
        this.brands = data;

        const brandIds = this.BrandId;
        console.log(brandIds);
      },
      error: (error) => {
        console.error('Error loading brands', error);
      }
    });
  }

  // Check if the category is selected
  categoryChecked(category: Category): boolean {
    return this.selectedCategories.some(c => c._id === category._id);
  }

  // Handle category selection change
  OnCategoryChange(category: Category, event: Event) {

    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      if (!this.selectedCategories.some(c => c._id === category._id)) {
        this.selectedCategories.push(category);
        console.log(this.selectedCategories);
      }

    }
    else {
      this.selectedCategories = this.selectedCategories.filter(item => item._id !== category._id);
      console.log(this.selectedCategories);
    }
    this.emitFilters();
  }

  // Check if the brand is selected
  brandChecked(brand: Brand): boolean {
    return this.selectedBrands.some(b => b._id === brand._id);
  }

  // Handle brand selection change
  OnBrandChange(brand: Brand, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      if (!this.selectedBrands.some(b => b._id === brand._id)) {
        this.selectedBrands.push(brand);
        console.log(this.selectedBrands);
      }
    } else {
      this.selectedBrands = this.selectedBrands.filter(item => item._id !== brand._id);
      console.log(this.selectedBrands);
    }

    this.emitFilters();
  }

  // Handle rating selection change
  onRatingChange(rating: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if(isChecked) {
      if(!this.selectedRatings.includes(rating)){
        this.selectedRatings.push(rating);
      }
    }else{
      this.selectedRatings = this.selectedRatings.filter(item => item !== rating);
    }
    this.emitFilters();
  }

  // Handle min price change
  onminPriceChange(minPrice: any) {
    const parsedMin = parseFloat(minPrice);
    this.minPrice = !isNaN(parsedMin) && parsedMin >= 0 ? parsedMin : null;
    this.priceChange$.next();  // Only trigger this
  }

  // Handle max price change
  onmaxPriceChange(maxPrice: any) {
    const parsedMax = parseFloat(maxPrice);
    this.maxPrice = !isNaN(parsedMax) && parsedMax >= 0 ? parsedMax : null;
    this.priceChange$.next();  // Only trigger this
  }

  // Emit the selected filters
  emitFilters() {
    // Validate that minPrice is not greater than maxPrice
    if (
      this.minPrice !== null && this.maxPrice !== null &&
      this.minPrice !== undefined && this.maxPrice !== undefined &&
      this.minPrice > this.maxPrice
    ) {
      this.errorprice = true;
      return;
    }
    else {
      this.errorprice = false;
    }
  
    this.filtersChanged.emit({
      selectedCategories: this.selectedCategories,
      selectedBrands: this.selectedBrands,
      selectedRatings: this.selectedRatings,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    });
  }
}
