import { Injectable } from '@angular/core';
import { CartProduct } from '../models/cartModel';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getCartFromLocalStorage(): CartProduct[] {
    const cartData = localStorage.getItem('cartProducts');
    return cartData ? JSON.parse(cartData) : [];
  }

  saveCartToLocalStorage(cartProducts: CartProduct[]) {
    localStorage.setItem('cartProducts', JSON.stringify(cartProducts));
  }
  EmptyCart(){
    localStorage.removeItem('cartProducts');
  }

  async addItemToCart(
    itemId: string,
    quantity: number,
    price: number,
    name: string,
    selectedColor: any,
    image: string,
    brandId: string,
    stock:number
  ): Promise<void> {
    const cart = this.getCartFromLocalStorage();
    const existingItemIndex = cart.findIndex(
      item => item.itemId === itemId && item.selectedColor === selectedColor
    );

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += quantity;
      this.saveCartToLocalStorage(cart);
      return;
    }

    try {
      // Fetch brand name from API
      const brand = await firstValueFrom(
        this.http.get<{name: string}>(`${this.apiUrl}/brand/${brandId}`)
      );

      const newItem: CartProduct = {
        itemId,
        quantity,
        price,
        name,
        selectedColor,
        image,
        brandId,
        brand: brand.name,
        stock
      };

      cart.push(newItem);
      this.saveCartToLocalStorage(cart);
    } catch (error) {
      console.error('Failed to fetch brand:', error);
    }
  }

  removeItemFromCart(itemId: string, selectedColor: any): void {
  let cart = this.getCartFromLocalStorage();
  cart = cart.filter(
    item => !(item.itemId === itemId && JSON.stringify(item.selectedColor) === JSON.stringify(selectedColor))
  );
  this.saveCartToLocalStorage(cart);
}


  getCartTotal(): number {
    const cart = this.getCartFromLocalStorage();
    return cart.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 0;
      return total + price * quantity;
    }, 0);
  }
}