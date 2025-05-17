// image.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private _imageUrl = new BehaviorSubject<string>('');
  imageUrl$ = this._imageUrl.asObservable();

  private _name = new BehaviorSubject<string>('');
  name$ = this._name.asObservable();

  setImageUrl(url: string) {
    this._imageUrl.next(url);
  }

  setName(name: string) {
    this._name.next(name);
  }
}
