import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/productModel';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/categoryModel';
import { CartService } from '../../../services/cart.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-product-sec1',
  templateUrl: './product-sec1.component.html',
  styles: '',
  // providers: [CategoryService],
  providers: [CategoryService, CartService],
  imports: [CommonModule],
})
export class ProductSec1Component implements OnInit {
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
  Categories: Category = {
    _id: '',
    categoryName: '',
    brandNames: [],
    __v: 0,
  };
  categoryName: string = '';
  quantity: number = 1;

  constructor(
    private categoryService: CategoryService,
    private cartService: CartService
  ) {
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
        this.selectedColor =
          this.productColors.length > 0 ? this.productColors[0] : '';
        this.selectedImage = this.product.imagesAndColors[this.selectedColor]
          ? this.product.imagesAndColors[this.selectedColor]
              .replace('github.com', 'raw.githubusercontent.com')
              .replace('/blob/', '/')
          : '';
      }
    }
  }

  ngOnInit(): void {
    if (this.product.category) {
      this.categoryService.getCategoryById(this.product.category).subscribe({
        next: (category) => {
          this.categoryName = category.categoryName;
          console.log(this.categoryName);
          console.log(category);
        },
        error: (err) => {
          console.error('Error fetching category:', err);
        },
      });
    } else {
      console.error('Product category is undefined or invalid.');
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
  firstAddition = true;
  clickAddtoCart(): void {
    if (this.firstAddition) {
      this.firstAddition = false;
      let saveQ = this.quantity;

      console.log('Trying to add item to cart...');

      // Check if quantity is less than or equal to the stock before adding to cart
      if (this.quantity > 0 && this.quantity <= (this.product.stock || 0)) {
        this.cartService
          .addItemToCart(
            this.product._id,
            saveQ,
            this.product.price,
            this.product.name,
            this.selectedColor,
            this.selectedImage,
            this.product.brand
          )
          .subscribe({
            next: (response) => {
              console.log('Item added successfully:', response);
            },
            error: (error) => {
              console.error('Error adding item to cart:', error);
            },
          });
      } else {
        // If the quantity is greater than stock, display an alert or message
        console.error('Not enough stock available.');
        // Optionally, you can show a user-friendly message in the UI here
      }
    }
  }
}
