import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = 'http://localhost:5000/api/users';

  constructor(private myHttp: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.myHttp.get<any>(this.url+"?page=1&size=100");
  }


  getUserById(id: string): Observable<any> {
    return this.myHttp.get<any>(`${this.url}/${id}`);
  }




}
