// admin-prods.component.ts
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../models/productModel';
import { ProductService } from '../../../services/product.service';
import { SearchService } from '../../../services/search.service';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { Brand } from '../../../models/brandModel';
import { Category } from '../../../models/categoryModel';
import { MessageService } from '../../../services/message.service';
import gsap from 'gsap';

@Component({
  selector: 'app-admin-prods',
  imports: [CommonModule, FormsModule, HttpClientJsonpModule],
  providers: [ProductService],
  templateUrl: './admin-prods.component.html',
})
export class AdminProdsComponent implements OnInit, AfterViewInit {
  @ViewChildren('productCard') productCards!: QueryList<ElementRef>;

  AllBrands: Brand[] = [];
  AllCategorys: Category[] = [];
  ratings: number[] = [1, 2, 3, 4, 5];
  currentpage: number = 1;
  itemsPerPage: number = 6;
  sortBy: string = 'default';
  AllProducts: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading: boolean = true;

  searchTerm: string = '';
  selectedCategory: string = '';
  selectedBrand: string = '';
  selectedRating: number | '' = '';

  editable: boolean = false;

  constructor(
    private productservice: ProductService,
    private searchservice: SearchService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private msg: MessageService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();

    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.AllCategorys = data;
      },
      error: (error) => {
        console.error('Error loading categories', error);
      },
    });

    this.brandService.getAllBrands().subscribe({
      next: (data) => {
        this.AllBrands = data;
      },
      error: (error) => {
        console.error('Error loading brands', error);
      },
    });

    this.searchservice.searchTerm$.subscribe((term) => {
      this.searchTerm = term;
      this.applyFilters();
    });
    
  }

  ngAfterViewInit(): void {
    gsap.from(
      this.productCards.map((c) => c.nativeElement),
      {
        opacity: 0.3,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      }
    );
  }

  fetchProducts() {
    this.isLoading = true;
    this.productservice.getAllProductsbyFilters().subscribe({
      next: (data) => {
        this.AllProducts = data || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.isLoading = false;
      },
    });
  }

  applyFilters() {
    this.filteredProducts = this.AllProducts.filter((product) => {
      const matchesCategory = this.selectedCategory
        ? product.category === this.selectedCategory
        : true;
      const matchesBrand = this.selectedBrand
        ? product.brand === this.selectedBrand
        : true;
      const matchesRating = this.selectedRating
        ? Math.floor(product.rating) == this.selectedRating
        : true;
      const matchesSearch = this.searchTerm
        ? product.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      return matchesCategory && matchesBrand && matchesRating && matchesSearch;
    });
    this.filteredProducts = this.sortProducts(this.filteredProducts);
    this.currentpage = 1;
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
    this.filteredProducts = this.sortProducts(this.filteredProducts);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentpage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  getFirstImage(product: any): string {
    if (
      product?.imagesAndColors &&
      Object.keys(product.imagesAndColors).length > 0
    ) {
      const firstKey = Object.keys(product.imagesAndColors)[0];
      return product.imagesAndColors[firstKey]
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/');
    }
    return 'assets/Images/default-product.png';
  }

  makeEditable() {
    this.editable = true;
  }

  editProduct(product: Product) {
    this.productservice.updateProduct(product._id, product).subscribe({
      next: () => {
        this.editable = false;
        this.fetchProducts();
        this.msg.show('Product Updated Successfully');
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.msg.show('Failed To Update Product, try later');
      },
    });
  }

  removeProduct(product: Product) {
    this.productservice.deleteProduct(product._id).subscribe({
      next: () => {
        this.fetchProducts();
        this.msg.show('Product Deleted Successfully');
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.msg.show('Failed To Delete Product, try later');
      },
    });
  }

  changePage(page: number) {
    this.currentpage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
