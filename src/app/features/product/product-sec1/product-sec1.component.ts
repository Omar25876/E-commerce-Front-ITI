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
  TotalQuantity:number=0;

  constructor(
    private categoryService: CategoryService,
    private cartService: CartService,
    private MsgSer: MessageService
  ) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedProduct = localStorage.getItem('product');
      console.log("storedProduct :");
      console.log(storedProduct);
      if (storedProduct) {
        this.product = JSON.parse(storedProduct);
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
    this.getQuantityInCart();
  }

  getQuantityInCart() {
  const cartProducts = this.cartService.getCartFromLocalStorage();

  // get the quantity whatever the color is
  const matchingProducts = cartProducts.filter(
    (prd: CartProduct) => prd.itemId === this.product._id
  );
  
  this.productQuantityInCart = matchingProducts.reduce(
    (total, prd) => total + prd.quantity,0
  );

  this.isOutOfStock = this.productQuantityInCart >= this.product.stock;
  this.remainingProduct = this.product.stock - this.productQuantityInCart;
  console.log("Remaining Product:0");
  console.log(this.remainingProduct);
  this.enteredQuantity = 0;
}


  selectImage(image: string): void {
    this.selectedImage = image;
  }

  selectColor(color: string): void {
    this.selectedColor = color;

    if (this.product.imagesAndColors[color]) {
      this.selectedImage = this.product.imagesAndColors[color]
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/');
    }
  }

  increaseQuantity(): void {
    if (this.enteredQuantity < (this.product.stock || 0)) {
      this.enteredQuantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.enteredQuantity > 1) {
      this.enteredQuantity--;
    }
  }

 clickAddtoCart(): void {
  console.log('Trying to add item to cart...');

  const cartProducts = this.cartService.getCartFromLocalStorage();
  
  const matchedProduct = cartProducts.find(
    (prd: CartProduct) =>
      prd.itemId === this.product._id && prd.selectedColor === this.selectedColor
  );

  const quantityInCart = matchedProduct ? matchedProduct.quantity : 0;

  const quantityToAdd = this.enteredQuantity - quantityInCart;

  if (this.product.stock <= quantityInCart) {
    console.log('No addition, product is out of stock');
    this.MsgSer.show(`Sorry, ${this.product.name}(${this.product.selectedColor}) is out of stock.`);
    return;
  }

  if (quantityToAdd <= 0) {
    this.MsgSer.show(`Quantity already in cart is up to date.`);
    return;
  }

  try {
    // Add to local storage cart
     this.cartService.addItemToCart(
      this.product._id,
      quantityToAdd,
      this.product.price,
      this.product.name,
      this.selectedColor,
      this.selectedImage,
      this.product.brand,
      this.product.stock
    );

    // Update UI state
    this.productQuantityInCart = quantityInCart + quantityToAdd;

    if (quantityInCart > 0) {
      this.MsgSer.show(`${this.product.name}(${this.product.selectedColor})'s quantity increased.`);
      this.TotalQuantity += quantityToAdd;
      this.remainingProduct= this.product.stock - this.TotalQuantity;
      this.enteredQuantity=0;
    } else {
      this.MsgSer.show(`${this.product.name}(${this.selectedColor}) added to cart.`);
      this.TotalQuantity +=quantityToAdd;
      this.remainingProduct= this.product.stock - this.TotalQuantity;
      this.enteredQuantity=0;
    }
  } catch (err) {
    console.error('Error adding item to cart:', err);
    this.MsgSer.show(`Error adding ${this.product.name}(${this.selectedColor}) to cart.`);
  }
}

}
