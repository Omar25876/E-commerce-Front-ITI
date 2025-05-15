import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/productModel';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/categoryModel';
import { CartService } from '../../../services/cart.service';
import { CartProduct } from '../../../models/cartModel';
import { MessageService } from '../../../services/message.service';

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
  isOutOfStock: boolean = false;
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
  enteredQuantity: number = 1;
  productQuantityInCart: number = 0;
  remainingProduct: number = 0;
  constructor(
    private categoryService: CategoryService,
    private cartService: CartService,
    private MsgSer:MessageService
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
    this.getQuantityInCart();
    this.remainingProduct =
      this.product.stock - this.enteredQuantity - this.productQuantityInCart;
  }

  getQuantityInCart() {
    let cartProducts: CartProduct[];
    this.cartService.getCart().subscribe({
      next: (data) => {
        cartProducts = data;
        console.log('Cart data:', cartProducts);

        const matchedProduct = cartProducts.find(
          (prd: CartProduct) => prd.itemId === this.product._id
        );

        if (matchedProduct) {
          this.productQuantityInCart = matchedProduct.quantity;
          console.log('Matched product quantity:', this.productQuantityInCart);
        } else {
          this.productQuantityInCart = 0;
          console.log('Product not found in cart.');
        }

        this.isOutOfStock = this.productQuantityInCart >= this.product.stock;
        this.remainingProduct = this.product.stock - this.productQuantityInCart;
        this.enteredQuantity = this.productQuantityInCart;
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
      },
    });
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
    if (this.enteredQuantity < (this.product.stock || 0)) {
      this.enteredQuantity++;
       this.remainingProduct =
      this.product.stock - this.enteredQuantity;
    }
  }

  decreaseQuantity(): void {
    if (this.enteredQuantity > 1) {
      this.enteredQuantity--;
       this.remainingProduct =
      this.product.stock - this.enteredQuantity;
    }
  }
  clickAddtoCart(): void {
    console.log('Trying to add item to cart...');

    // stock check
    this.getQuantityInCart();

    console.log('▶ this.isOutOfStock', this.isOutOfStock);
    console.log('▶ this.productQuantityInCart', this.productQuantityInCart);
    console.log('▶ this.product.stock', this.product.stock);
    if (this.isOutOfStock) {
      console.log('No addition');

      // console.log(storedProduct);
      // disable addition button and make the text be Out of stock
    } else {
      console.log('yes addition');
      this.cartService
        .addItemToCart(
          this.product._id,
          this.enteredQuantity - this.productQuantityInCart,
          this.product.price,
          this.product.name,
          this.selectedColor,
          this.selectedImage,
          this.product.brand
        )
        .subscribe({
          next: (response) => {
            console.log('Item added successfully:', response);
            this.getQuantityInCart();
          },
        });
    }
    if(this.productQuantityInCart>0)
      this.MsgSer.show(`${this.product.name}'s Quantity increased`);
    if(this.productQuantityInCart==0 && !this.isOutOfStock)
      this.MsgSer.show(`${this.product.name} Added To Cart`);
    
  }
}
