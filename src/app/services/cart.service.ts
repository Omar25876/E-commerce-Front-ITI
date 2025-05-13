import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CartProduct } from '../models/cartModel';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:5000/api/cart';

  userData: any;
  userId: string = '';
  constructor(private http: HttpClient, private authservice: AuthService) {
    this.userData = this.authservice.getUserData();
    this.userId = this.userData._id;
  }

  // Get cart for a specific user
  getCart() {
    return this.http.get<CartProduct[]>(`${this.apiUrl}/${this.userId}`);
  }

  // Add an item to the cart
  addItemToCart(
    itemId: string,
    quantity: number,
    price: number,
    name: string,
    selectedColor: any,
    image: string,
    brandId: string
  ): Observable<any> {
    const payload = {
      itemId,
      quantity,
      name,
      price,
      selectedColor,
      image,
      brandId,
    };
    console.log(
      `cart service : ${this.apiUrl}/${this.userId}/items\n`,
      'payload : ',
      payload
    );
    return this.http.post(`${this.apiUrl}/${this.userId}/items`, payload);
  }

  // remove an item from the cart
  removeItemFromCart(itemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${this.userId}/items/${itemId}`);
  }
}
