import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './../../../services/cart.service';
import { CartProduct } from '../../../models/cartModel';
import { MessageService } from '../../../services/message.service';
import { CompareService } from '../../../services/compare.service';
import { StorageService } from '../../../services/storage.service';
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
     private MsgSer:MessageService,
    private compareservice:CompareService,
    private storage: StorageService

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
        this.MsgSer.show(`${product.name}(${product.selectedColor}) is already in the cart.`);
        return;
      }

      const imageUrl = this.getProductImageUrl(product);

      // Add item to cart synchronously
      console.log(product);
      console.log(imageUrl);
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

      this.MsgSer.show(`${product.name}(${product.selectedColor}) added to cart.`);
    } catch (err) {
      console.error('Error adding item to cart:', err);
      this.MsgSer.show(`Error adding ${product.name} to cart.`);
    }
  }

  private getProductImageUrl(product: any): string {
    const image = product.imagesAndColors?.[product.selectedColor];
    return image
      ? image
          .replace('https://github.com/', 'https://raw.githubusercontent.com/')
          .replace('/blob/', '/')
      : '';
  }

  // Other methods remain unchanged
  addToComparelist(product: any): void {
    this.compareservice.addToCompare(product)
    console.log('Added to CompareList:', product);
  }

  quickView(): void {

      this.storage.setItem('product', this.myProduct);
      this.router.navigate(['/product', this.myProduct._id]);
  }


}
