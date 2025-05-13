import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { StorageService } from './storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storage: StorageService){}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token =  this.storage.getItem('token');
    console.log('token',token)
    if (token) {
      // Clone the request and add the Authorization header
      req  = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(req); // Pass the request as-is if no token is found
  }
}
