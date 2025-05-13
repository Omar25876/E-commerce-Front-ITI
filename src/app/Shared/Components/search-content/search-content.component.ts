import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HttpClientJsonpModule } from '@angular/common/http';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/productModel';
import { ProductCardComponent } from "../product-card/product-card.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-content',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientJsonpModule,
    ProductCardComponent,
  ],
  providers: [ProductService],
  templateUrl: './search-content.component.html',
  styles: ``,
})
export class SearchContentComponent implements OnInit, OnChanges {
  constructor(private productservice: ProductService) { }

  currentpage: number = 1;
  itemsPerPage: number = 8;
  sortBy: string = 'default';
  AllProducts: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading: boolean = true;

  @Input() filters: any;
  @Input() searchTerm: string = '';

  get categoriesName(): string {
    if (this.filters?.selectedCategories?.length > 0) {
      return this.filters.selectedCategories.map((c: { categoryName: any }) => c.categoryName).join(', ');
    }
    return 'All Categories';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      this.fetchProducts();
    } else if (changes['searchTerm']) {
      this.filteredProducts = this.filterProducts(this.AllProducts);
    }
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    if (this.filters) {
      const categories = this.filters.selectedCategories?.map((c: { categoryName: any }) => c.categoryName);
      const brands = this.filters.selectedBrands?.map((b: { brandName: any }) => b.brandName);

      this.isLoading = true;

      this.productservice.getAllProductsbyFilters(
      ).subscribe({
        next: (data) => {
          this.AllProducts = data || [];
          // console.log(this.AllProducts);
          this.filteredProducts = this.filterProducts(this.AllProducts);
          // console.log(this.filteredProducts);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching products:', error);
          this.isLoading = false;
        }
      });
    } else {
      console.error("Filters are undefined or null");
    }
  }

  filterProducts(products: Product[]): Product[] {
    if (!products || products.length === 0) return [];

    let filtered = [...products];

    // Search term filter
    if (this.searchTerm) {
      const lowerSearch = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(lowerSearch)
      );
    }

    // Rating filter (rounded down)
    if (this.filters.selectedRatings && this.filters.selectedRatings.length > 0) {
      filtered = filtered.filter(product =>
        this.filters.selectedRatings.includes(Math.floor(product.rating))
      );
    }

    // Category filter (case-insensitive)
    if (this.filters.selectedCategories && this.filters.selectedCategories.length > 0) {
      const categoryNames = this.filters.selectedCategories.map((c: { categoryName: string }) => c.categoryName.toLowerCase());
      // console.log('catName',categoryNames);
      filtered = filtered.filter(product =>product.category?.toLowerCase() === categoryNames.find((cat: string) => cat === product.category?.toLowerCase()));
        // console.log('product',product.category?.toLowerCase()), 
        // console.log('filtered',filtered)
    }

    // Brand filter (case-insensitive)
    if (this.filters.selectedBrands && this.filters.selectedBrands.length > 0) {
      const name = this.filters.selectedBrands.map((b: { name: string }) => b.name?.toLowerCase());
      // console.log('brandName',name);
      filtered = filtered.filter(product =>
        product.brand?.toLowerCase() === name.find((brand: string) => brand === product.brand?.toLowerCase())
      );
    }

    // Price range filter
    if (!isNaN(this.filters.minPrice) && this.filters.minPrice !== null) {
      filtered = filtered.filter(product =>
        product.price >= this.filters.minPrice
      );
    }

    if (!isNaN(this.filters.maxPrice) && this.filters.maxPrice !== null) {
      filtered = filtered.filter(product =>
        product.price <= this.filters.maxPrice
      );
    }

    // Final sort
    return this.sortProducts(filtered);
  }

  sortProducts(products: Product[]): Product[] {
    let sorted = [...products];
    if (this.sortBy === 'rating') {
      sorted = sorted.sort((a, b) => b.rating - a.rating);
    } else if (this.sortBy === 'PriceLowToHigh') {
      sorted = sorted.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'PriceHighToLow') {
      sorted = sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  }

  OnSortChange(sort: string) {
    this.sortBy = sort;
    this.filteredProducts = this.filterProducts(this.AllProducts);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentpage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentpage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
