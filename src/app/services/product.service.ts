import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Product, ProductResponse } from '../models/productModel';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  url = 'http://localhost:5000/api/products';
  private cachedProducts: any[] | null = null; // Cache for products


  constructor(private myHttp: HttpClient, private router: Router) {}



  getAllProducts(): Observable<ProductResponse> {
    return this.myHttp.get<ProductResponse>(this.url);
  }

  getProductById(id: number): Observable<Product> {
    return this.myHttp.get<Product>(this.url + '/' + id);
  }

  addProduct(product: any) {
    return this.myHttp.post(this.url, product);
  }
  updateProduct(id: number, product: any) {
    return this.myHttp.put(this.url + '/' + id, product);
  }
  deleteProduct(id: number) {
    return this.myHttp.delete(this.url + '/' + id);
  }
}
