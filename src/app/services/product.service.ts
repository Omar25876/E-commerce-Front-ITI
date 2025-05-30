import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, switchMap, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Product, ProductResponse } from '../models/productModel';
import { environment } from '../../environment/environment'; 
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private url = `${environment.apiBase}/products`;
  private cachedProducts: Product[] | null = null; // Cache for products

  constructor(private myHttp: HttpClient, private router: Router) {}

  /**
   * Fetch all products
   * @returns Observable<ProductResponse>
   */
  getAllProducts(): Observable<ProductResponse> {
    return this.myHttp.get<ProductResponse>(this.url);
  }

  /**
   * Fetch products with filters and pagination
   * @param type - Product type (e.g., 'popular')
   * @param sort - Sorting criteria (e.g., 'rating')
   * @param minPrice - Minimum price
   * @param maxPrice - Maximum price
   * @param limit - Number of products per page
   * @returns Observable<Product[]>
   */
  getAllProductsbyFilters(
    type: string = 'popular',
    sort: string = 'rating',
    minPrice: number = 0,
    maxPrice: number = 999999,
    limit: number = 10,
    categories?: string[] ,
    brands?: string[] ,
    ratings?: number[] 
  ): Observable<Product[]> {
    let initialParams = new HttpParams()
      .set('page', '1')
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('type', type)
      .set('minPrice', minPrice.toString())
      .set('maxPrice', maxPrice.toString());

      if(categories && categories.length > 0) {
        categories.forEach((category) =>{
          initialParams=initialParams.append('categories', category);
        })
      }

      if(brands&& brands.length > 0) {
        brands.forEach((brand)=>{
          initialParams=initialParams.append('brands', brand);
        })
      }
      if(ratings && ratings.length > 0) {
        ratings.forEach((rating)=>{
          initialParams=initialParams.append('ratings', rating.toString());
        })
      }

    // First request to get total pages
    return this.myHttp
      .get<ProductResponse>(this.url, { params: initialParams })
      .pipe(
        switchMap((response) => {
          const total = response.total;
          const totalPages = Math.ceil(total / limit);

          // Generate requests for all pages
          const requests: Observable<ProductResponse>[] = [];
          for (let page = 1; page <= totalPages; page++) {
            const pageParams = initialParams.set('page', page.toString());
            requests.push(
              this.myHttp.get<ProductResponse>(this.url, { params: pageParams })
            );
          }

          return forkJoin(requests);
        }),
        map((responses) => {
          // Combine all product arrays into one flat array
          return responses.flatMap((res) => res.products);
        })
      );
  }

  /**
   * Fetch a single product by ID
   * @param id - Product ID
   * @returns Observable<Product>
   */
  getProductById(id: string): Observable<Product> {
    return this.myHttp.get<Product>(`${this.url}/${id}`);
  }

  /**
   * Add a new product
   * @param product - Product data
   * @returns Observable<Product>
   */
  addProduct(product: Product): Observable<Product> {
    return this.myHttp.post<Product>(this.url, product);
  }
  addProductFormData(productFormData: FormData): Observable<Product> {
  return this.myHttp.post<Product>(this.url, productFormData);
}


  /**
   * Update an existing product
   * @param id - Product ID
   * @param product - Updated product data
   * @returns Observable<Product>
   */
  updateProduct(id: string, product: Product): Observable<Product> {
    return this.myHttp.put<Product>(`${this.url}/${id}`, product);
  }

  /**
   * Delete a product by ID
   * @param id - Product ID
   * @returns Observable<void>
   */
  deleteProduct(id: string): Observable<void> {
    return this.myHttp.delete<void>(`${this.url}/${id}`);
  }

  addReviewToProduct(id: string, review: any): Observable<any> {
    return this.myHttp.post<any>(`${this.url}/${id}/reviews`, review);
  }
}
