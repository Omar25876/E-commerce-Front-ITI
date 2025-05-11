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
    console.log('userdata cartservice');
    this.userData = this.authservice.getUserData();
    this.userId = this.userData._id;
  }

  // Get cart for a specific user
  getCart(userId: string) {
    return this.http.get<CartProduct[]>(`${this.apiUrl}/${userId}`);
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
    console.log('in addItemToCart');
    console.log('itemId:', itemId);
    console.log('quantity:', quantity);
    console.log('price:', price);
    console.log('userId:', this.userId);
    console.log('api:', `${this.apiUrl}/${this.userId}/items`);

    const payload = {
      itemId,
      quantity,
      name,
      price,
      selectedColor,
      image,
      brandId,
    };

    return this.http.post(`${this.apiUrl}/${this.userId}/items`, payload);
  }

  // remove an item from the cart
  removeItemFromCart(itemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${this.userId}/items/${itemId}`);
  }
}
