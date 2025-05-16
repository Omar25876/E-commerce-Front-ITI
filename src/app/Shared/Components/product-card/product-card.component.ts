import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './../../../services/cart.service';
import { CartProduct } from '../../../models/cartModel';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  providers: [CartService],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent implements OnInit {
  @Input() myProduct: any;
  image: string = '';
  rawUrl: string = '';

  constructor(
    private router: Router,
    private cartService: CartService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.setDefaultImage();
  }

  private setDefaultImage(): void {
    if (this.myProduct?.imagesAndColors) {
      const firstColorKey = Object.keys(this.myProduct.imagesAndColors)[0];
      this.image = this.myProduct.imagesAndColors[firstColorKey] || '';
      this.rawUrl = this.image
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/');
    }
  }

  addToCart(product: any): void {
    try {
      const cart: CartProduct[] = this.cartService.getCartFromLocalStorage();

      // Check if product is already in cart
      const alreadyInCart = cart.find((p) => p.itemId === product._id && p.quantity > 0);

      if (alreadyInCart) {
        this.messageService.show(`${product.name}(${product.selectedColor}) is already in the cart.`);
        return;
      }

      const imageUrl = this.getProductImageUrl(product);

      // Add item to cart synchronously
      console.log(product);
      this.cartService.addItemToCart(
        product._id,
        1,
        product.price,
        product.name,
        product.selectedColor,
        imageUrl,
        product.brand,
        product.stock
      );

      this.messageService.show(`${product.name}(${product.selectedColor}) added to cart.`);
    } catch (err) {
      console.error('Error adding item to cart:', err);
      this.messageService.show(`Error adding ${product.name} to cart.`);
    }
  }

  private getProductImageUrl(product: any): string {
    const image = product.imagesAndColors?.[product.selectedColor?.toLowerCase()];
    return image
      ? image
          .replace('https://github.com/', 'https://raw.githubusercontent.com/')
          .replace('/blob/', '/')
      : '';
  }

  // Other methods remain unchanged
  addToComparelist(product: any): void {
    console.log('Added to CompareList:', product);
  }

  quickView(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('product', JSON.stringify(this.myProduct));
      this.router.navigate(['/product', this.myProduct._id]);
    }
  }
}
