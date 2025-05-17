import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderResponse, SingleOrderResponse } from '../models/orderModel';
import { environment } from '../../environment/environment'; 
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private url = `${environment.apiBase}/orders`;

  constructor(private myHttp: HttpClient) { }

  getAllOrders():Observable<OrderResponse>{
    return this.myHttp.get<OrderResponse>(this.url);
  }

  getAllOrdersByUserId(id:string):Observable<OrderResponse>{
    return this.myHttp.get<OrderResponse>(`${this.url}/user/${id}`);
  }

  getOrderById(id:string):Observable<SingleOrderResponse>{
    return this.myHttp.get<SingleOrderResponse>(`${this.url}/${id}`);
  }

  addOrder(order:any):Observable<any>{
    return this.myHttp.post<any>(this.url,order);
  }

  updateOrder(id:string,order:any):Observable<any>{
    return this.myHttp.put<any>(`${this.url}/${id}`,order);
  }

  deleteOrder(id:string):Observable<any>{
    return this.myHttp.delete<any>(`${this.url}/${id}`);
  }

}
