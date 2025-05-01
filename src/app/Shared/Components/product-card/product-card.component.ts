import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styles: '',
})
export class ProductCardComponent {
  constructor(private router: Router) {} // Ensure Router is injected

  @Input() myProduct: any;

  addToCart(product: any): void {
    console.log('Added to cart:', product);
    // Add logic to handle adding the product to the cart
  }

  addToWishlist(product: any): void {
    console.log('Added to wishlist:', product);
    // Add logic to handle adding the product to the wishlist
  }

  quickView(): void {
    console.log('Quick view:', this.myProduct);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('product', JSON.stringify(this.myProduct)); // Store product in localStorage
      this.router.navigate(['/product', this.myProduct._id]); // Navigate to the product page
    }
  }
}
