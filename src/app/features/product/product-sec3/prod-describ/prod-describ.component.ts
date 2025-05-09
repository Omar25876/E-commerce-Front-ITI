import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../models/productModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prod-describ',
  imports: [CommonModule],
  templateUrl: './prod-describ.component.html',
  styles: ``
})
export class ProdDescribComponent implements OnInit {
  product: Product = {
      _id: '',
      name: '',
      description: '',
      price: 0,
      oldPrice: 0,
      discount: 0,
      colors: [],
      images: [],
      imagesAndColors: {},
      selectedColor: '',
      stock: 0,
      rating: 0,
      reviewsCount: 0,
      reviews: [],
      highlights: [],
      specs: {},
      modelNumber: '',
      modelName: '',
      whatsInTheBox: [],
      isPopular: false,
      isNewArrival: false,
      isDiscover: false,
      category: '',
      brand: '',
      createdAt: '',
      updatedAt: '',
    };

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedProduct = localStorage.getItem('product');
      if (storedProduct) {
        this.product = JSON.parse(storedProduct);
      }
    }
  }

  getSpecs(): { key: string; value: string }[] {
    return Object.entries(this.product.specs).map(([key, value]) => ({
      key,
      value,
    }));
  }

}
