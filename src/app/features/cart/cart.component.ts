import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  selectedProduct: any = null;

  cartProducts = [
    {
      name: 'Wireless Headphones',
      brand: 'Anker',
      image: 'Images/Cart-Page/testCart1.webp',
      price: 1200,
      quantity: 2,
      color: 'White',
    },
    {
      name: 'Wired Headphones',
      brand: 'JBL',
      image: 'Images/Cart-Page/testCart2.jpg',
      price: 80,
      quantity: 1,
      color: 'black',
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
}
