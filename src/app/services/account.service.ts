import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from '../models/profileModel';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private url = 'http://localhost:5000/api/profile'

  constructor(private myHttp: HttpClient) { }

  getProfile(): Observable<UserResponse> {
    return this.myHttp.get<UserResponse>(this.url);
  }

  updateProfile(profile: any) {
    return this.myHttp.put(this.url, profile);
  }

  deleteProfile() {
    return this.myHttp.delete(this.url);
  }

  deletePaymentCard(id: string) {
    return this.myHttp.delete(`${this.url}/payment-card/${id}`);
  }



}
