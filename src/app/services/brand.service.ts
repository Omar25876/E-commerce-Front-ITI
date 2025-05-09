import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Brand } from '../models/brandModel';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private url = 'http://localhost:5000/api/brand'

  constructor(private myHttp:HttpClient) { }

  getAllBrands():Observable<Brand[]>{
    return this.myHttp.get<Brand[]>(this.url)
  }

  getBrandById(id:string):Observable<Brand>{
    return this.myHttp.get<Brand>(`${this.url}/${id}`)
  }

  addBrand(brand:any){
    return this.myHttp.post<Brand>(this.url,brand)
  }

  updateBrand(id:string,brand:any){
    return this.myHttp.put<Brand>(`${this.url}/${id}`,brand)
  }

  deleteBrand(id:string){
    return this.myHttp.delete<Brand>(`${this.url}/${id}`)
  }


}
