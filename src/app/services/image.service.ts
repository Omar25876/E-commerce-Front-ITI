// image.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private _imageUrl = new BehaviorSubject<string>('');
  imageUrl$ = this._imageUrl.asObservable();

  setImageUrl(url: string) {
    this._imageUrl.next(url);
  }
}
