import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './../../../services/cart.service';
import { CartProduct } from '../../../models/cartModel';
@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  providers: [CartService],
  templateUrl: './product-card.component.html',
  styles: '',
})
export class ProductCardComponent {
  @Input() myProduct: any; // Input property to receive product data

  image: string = ''; // Default value for the product image
  rawUrl: string = '';
  constructor(private router: Router, private cartService: CartService) {}

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
    this.cartService.getCart().subscribe({
      next: (data) => {
        const cartProducts: CartProduct[] = data;
        console.log('Cart data:', cartProducts);

        // get product in cart
        const matchedProduct = cartProducts.find(
          (prd: CartProduct) => prd.itemId === product._id
        );

        if (
          matchedProduct &&
          matchedProduct.quantity !== 0 &&
          matchedProduct.quantity !== undefined
        ) {
          // If the product is already in the cart and its quantity is not 0 or undefined, do nothing
          console.log('Product already in cart, skipping add.');
          return;
        }

        this.cartService
          .addItemToCart(
            product._id,
            1,
            product.price,
            product.name,
            product.selectedColor,
            product.imagesAndColors[product.selectedColor.toLowerCase()]
              .replace(
                'https://github.com/',
                'https://raw.githubusercontent.com/'
              )
              .replace('/blob/', '/'),
            product.brand
          )
          .subscribe({
            next: (response) => {
              console.log('Item added to cart:', response);
            },
            error: (err) => {
              console.error('Error adding item to cart:', err);
            },
          });
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
      },
    });
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
