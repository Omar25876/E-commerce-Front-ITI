import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PromoCode } from '../models/PromoCodeModel';

@Injectable({
  providedIn: 'root'
})
export class PromoCodeService {

  private url = 'http://localhost:5000/api/promocode';

  constructor(private http: HttpClient) {}

  // Get all promo codes
  getAllPromoCodes(): Observable<PromoCode[]> {
    return this.http.get<PromoCode[]>(this.url);
  }

  createPromoCode(promo: Partial<PromoCode>): Observable<PromoCode> {
    return this.http.post<PromoCode>(this.url, promo);
  }


  updatePromoCode(id: string, promo: Partial<PromoCode>): Observable<PromoCode> {
    return this.http.put<PromoCode>(`${this.url}/${id}`, promo);
  }

  deletePromoCode(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
