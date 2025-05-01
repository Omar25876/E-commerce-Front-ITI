import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Product } from '../../../models/productModel';

@Component({
  selector: 'app-product-sec1',
  templateUrl: './product-sec1.component.html',
  styles: '',
  imports: [CommonModule],
})
export class ProductSec1Component {
  product: Product = {
    _id: '',
    name: '',
    description: '',
    price: 0,
    oldPrice: 0,
    discount: 0,
    colors: [],
    selectedColor: '',
    stock: 0,
    rating: 0,
    reviewsCount: 0,
    images: [],
    highlights: [],
    specs: {},
    modelNumber: '',
    modelName: '',
    whatsInTheBox: [],
    isPopular: false,
    isNewArrival: false,
    isDiscover: false,
    category: '',
    __v: 0,
    createdAt: '',
    updatedAt: '',
  };

  productImages: string[] = [
    'Images/Prod-Page/1.png',
    'Images/Prod-Page/2.png',
    'Images/Prod-Page/3.png',
    'Images/Prod-Page/4.png',
  ];
  selectedImage: string = this.productImages[0];

  productColors: string[] = [];
  selectedColor: string = '';
  quantity: number = 1;

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedProduct = localStorage.getItem('product');
      if (storedProduct) {
        this.product = JSON.parse(storedProduct);

        // Ensure product.colors is defined and assign it to productColors
        this.productColors = this.product.colors || [];
        this.selectedColor = this.productColors.length > 0 ? this.productColors[0] : '';
      }
    }
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  increaseQuantity(): void {
    if (this.quantity < (this.product.stock || 0)) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
