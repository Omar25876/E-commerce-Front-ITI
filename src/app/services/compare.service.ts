import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MessageService } from './message.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompareService {
  private compareProducts = new BehaviorSubject<any[]>([]);
  compareProducts$ = this.compareProducts.asObservable();
  private isBrowser: boolean;

  constructor(
    private msg: MessageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const stored = localStorage.getItem('CompareList');
      if (stored) {
        this.compareProducts.next(JSON.parse(stored));
      }
    }
  }

  private updateStorage(products: any[]) {
    if (this.isBrowser) {
      localStorage.setItem('CompareList', JSON.stringify(products));
    }
    this.compareProducts.next(products);
  }

  setCompareProducts(products: any[]) {
    this.updateStorage(products);
  }

  addToCompare(product: any) {
    const current = this.compareProducts.getValue();
    const exist = current.find(prod => prod._id === product._id);

    if (!exist) {
      if (current.length < 3) {
        const updated = [...current, product];
        this.updateStorage(updated);
        this.msg.show(`${product.name} Added Successfully To Compare List`);
      } else {
        this.msg.show('You can only compare up to 3 products.');
      }
    } else {
      this.msg.show(`${product.name} is already in the compare list.`);
    }
  }

  getCompare() {
    return this.compareProducts.getValue();
  }

  removeFromCompare(id: string) {
    const current = this.compareProducts.getValue();
    const updated = current.filter(prod => prod._id !== id);
    this.updateStorage(updated);
    this.msg.show(`Product Removed Successfully.`);
  }

  clearCompare() {
    this.updateStorage([]);
    this.msg.show(`Compare List Cleared Successfully.`);
  }
}
