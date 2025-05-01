import { Component, OnInit } from '@angular/core';
import { ProductCardComponent } from "../../../Shared/Components/product-card/product-card.component";
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home-sec5',
  providers: [ProductService],
  imports: [ProductCardComponent, CommonModule, HttpClientModule],
  templateUrl: './home-sec5.component.html',
  styleUrl: './home-sec5.component.css'
})
export class HomeSec5Component implements OnInit {
  productList: any[] = []; // Ensure productList is an array
  isLoading: boolean = true; // Add a loading state
  errorMessage: string = ''; // Add an error message state

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProductsFromLocalStorage();
    this.fetchProducts();
  }

  /**
   * Load products from localStorage if available
   */
  loadProductsFromLocalStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedProducts = localStorage.getItem('popularProducts');
      if (storedProducts) {
        this.productList = JSON.parse(storedProducts);
        this.isLoading = false; // Set loading to false if products are loaded from localStorage
      }
    }
  }

  /**
   * Fetch products from the API and update localStorage
   */
  fetchProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        console.log('Products fetched:', data.products);
        const popularProducts = data.products.filter((product: any) => product.isPopular === true);

        // Update localStorage and productList
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('popularProducts', JSON.stringify(popularProducts));
        }
        this.productList = popularProducts;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.errorMessage = 'Failed to load products. Please try again later.';
        this.isLoading = false;
      },
      complete: () => {
        console.log('Product fetching completed.');
      }
    });
  }
}
