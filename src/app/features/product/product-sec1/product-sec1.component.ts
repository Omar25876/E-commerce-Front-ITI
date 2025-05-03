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

  productImages: string[] = [];
  selectedImage: string = '';
  productColors: string[] = [];
  selectedColor: string = '';
  quantity: number = 1;

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedProduct = localStorage.getItem('product');
      if (storedProduct) {
        this.product = JSON.parse(storedProduct);

        // Ensure product.colors is defined and assign it to productColors
        this.productColors = this.product.imagesAndColors
          ? Object.keys(this.product.imagesAndColors)
          : [];
        this.productImages = this.product.imagesAndColors
          ? Object.values(this.product.imagesAndColors).map((image) =>
              image
                .replace('github.com', 'raw.githubusercontent.com')
                .replace('/blob/', '/')
            )
          : [];
        this.selectedColor = this.productColors.length > 0 ? this.productColors[0] : '';
        this.selectedImage = this.product.imagesAndColors[this.selectedColor]
          ? this.product.imagesAndColors[this.selectedColor]
              .replace('github.com', 'raw.githubusercontent.com')
              .replace('/blob/', '/')
          : '';
      }
    }
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  selectColor(color: string): void {
    this.selectedColor = color;

    // Update the selected image based on the selected color
    if (this.product.imagesAndColors[color]) {
      this.selectedImage = this.product.imagesAndColors[color]
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/');
    }
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
