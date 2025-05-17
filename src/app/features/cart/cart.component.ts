import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartProduct } from '../../models/cartModel';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartItems: CartProduct[] = [];
  selectedItem: CartProduct | null = null;

  constructor(private cartService: CartService,private Storage:StorageService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartFromLocalStorage();
    console.log(this.cartItems);
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }

  selectItem(item: CartProduct): void {
    this.selectedItem = this.selectedItem === item ? null : item;
  }

  increaseQuantity(item: CartProduct): void {
    this.cartService.addItemToCart(
      item.itemId,
      1,
      item.price,
      item.name,
      item.selectedColor,
      item.image,
      item.brand,
      item.stock
    );
    this.loadCart(); // Refresh the cart after modification
  }

  decreaseQuantity(item: CartProduct): void {
    if (item.quantity > 1) {
      this.cartService.addItemToCart(
        item.itemId,
        -1,
        item.price,
        item.name,
        item.selectedColor,
        item.image,
        item.brand,
        item.stock
      );
      this.loadCart(); 
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: CartProduct): void {
    this.cartService.removeItemFromCart(item.itemId,item.selectedColor);
    this.cartItems = this.cartItems.filter(
      i => !(i.itemId === item.itemId && i.selectedColor === item.selectedColor)
    );

  }

  trackByItemId(index: number, item: CartProduct): string {
    return item.itemId;
  }
}