import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/categoryModel';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private url = 'http://localhost:5000/api/category'

  constructor(private myHttp: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    return this.myHttp.get<Category[]>(this.url);
  }

  getCategoryById(id: string): Observable<Category> {
    return this.myHttp.get<Category>(`${this.url}/${id}`);
  }

  addCategory(category: any) {
    return this.myHttp.post(this.url, category);
  }

  updateCategory(id: string, category: any) {
    return this.myHttp.put(`${this.url}/${id}`, category);
  }

  deleteCategory(id: string) {
    return this.myHttp.delete(`${this.url}/${id}`);
  }

}
