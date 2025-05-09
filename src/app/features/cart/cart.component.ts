import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  selectedProduct: any = null;

  cartProducts = [
    {
      name: 'Sports X20',
      brand: 'Anker',
      image: 'Images/Cart-Page/testCart1.png',
      price: 120,
      quantity: 2,
      color: 'Green',
    },
    {
      name: 'Liberty 4 Pro',
      brand: 'JBL',
      image: 'Images/Cart-Page/testCart2.png',
      price: 80,
      quantity: 1,
      color: 'Black',
    },
  ];
  getCartTotal() {
    return this.cartProducts.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
  selectProduct(product: any) {
    this.selectedProduct = this.selectedProduct === product ? null : product;
  }

  increaseQty(product: any) {
    product.quantity++;
  }

  decreaseQty(product: any) {
    if (product.quantity > 1) {
      product.quantity--;
    } else {
      this.removeProduct(product);
    }
  }

  removeProduct(product: any) {
    this.cartProducts = this.cartProducts.filter((p) => p !== product);
    if (this.selectedProduct === product) this.selectedProduct = null;
  }
  goToCheckout() {}
  continueShopping() {}
}
