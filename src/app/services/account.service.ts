import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private url = 'http://localhost:5000/api/profile'

  constructor(private myHttp: HttpClient) { }



}
