import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
interface productInformation{
  name:string,
  rate:number,
  price:string,
  numberOfReviews:number
  
  }
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [
    CommonModule
  ],
  templateUrl: './product-card.component.html',
  styles: '',
})
export class ProductCardComponent {
  @Input() myProduct:productInformation={
    name: '',
    rate: 0,
    price: '0',
    numberOfReviews: 0
  };

  // AllPRoduct:productInformation[]=[
  //   { name: 'Product 1', price: 2500, rate: 4.5, numberOfReviews: 120 },
  //   { name: 'Product 2', price: 1999, rate: 4.0, numberOfReviews: 90 },
  //   { name: 'Product 3', price: 3000, rate: 5.0, numberOfReviews: 200 },
  //   { name: 'Product 4', price: 1500, rate: 3.5, numberOfReviews: 75 },
  //   { name: 'Product 5', price: 2800, rate: 4.8, numberOfReviews: 150 },
  //   { name: 'Product 6', price: 2300, rate: 4.2, numberOfReviews: 60 },
  //   { name: 'Product 7', price: 2100, rate: 4.7, numberOfReviews: 85 },
  //   { name: 'Product 8', price: 3200, rate: 5.0, numberOfReviews: 300 },
  //   { name: 'Product 9', price: 3200, rate: 5.0, numberOfReviews: 300 },
  //   { name: 'Product 10', price: 3200, rate: 5.0, numberOfReviews: 300 },
  // ]

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
