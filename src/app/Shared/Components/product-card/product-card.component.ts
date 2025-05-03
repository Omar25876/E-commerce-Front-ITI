import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styles: '',
})
export class ProductCardComponent {
  @Input() myProduct: any; // Input property to receive product data

  image: string = ''; // Default value for the product image
  rawUrl: string = '';
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Ensure myProduct and imagesAndColors are defined before accessing them
    if (this.myProduct && this.myProduct.imagesAndColors) {
      const firstColorKey = Object.keys(this.myProduct.imagesAndColors)[0];
      this.image = this.myProduct.imagesAndColors[firstColorKey] || ''; // Set the first image
      this.rawUrl = this.image
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/');
    }
  }

  /**
   * Add the product to the cart
   * @param product - The product to add to the cart
   */
  addToCart(product: any): void {
    console.log('Added to cart:', product);
    // Add logic to handle adding the product to the cart
  }

  /**
   * Add the product to the wishlist
   * @param product - The product to add to the wishlist
   */
  addToWishlist(product: any): void {
    console.log('Added to wishlist:', product);
    // Add logic to handle adding the product to the wishlist
  }

  /**
   * Navigate to the product's quick view page
   */
  quickView(): void {
    console.log('Quick view:', this.myProduct);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('product', JSON.stringify(this.myProduct)); // Store product in localStorage
      this.router.navigate(['/product', this.myProduct._id]); // Navigate to the product page
    }
  }
}
