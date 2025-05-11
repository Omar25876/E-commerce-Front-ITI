import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CartProduct } from '../../models/cartModel';
import { BrandService } from '../../services/brand.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  providers: [AuthService],
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartProducts: CartProduct[] = [];
  selectedProduct: CartProduct | null = null;
  userData: any;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private brandService: BrandService
  ) {}

  ngOnInit(): void {
    this.cartService.getCart(this.authService.getUserData()._id).subscribe({
      next: (data) => {
        this.cartProducts = data;
        console.log('Cart data:', this.cartProducts);
        this.cartProducts.forEach((product) => {
          console.log(product);
          console.log(product.brandId);
          this.brandService.getBrandById(product.brandId).subscribe((brand) => {
            product.brand = brand.name;
            console.log(product.brand);
          });
        });
      },
      error: (err) => {
        console.error('Failed to load cart:', err);
      },
    });
  }

  getCartTotal() {
    return this.cartProducts.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  selectProduct(product: any) {
    this.selectedProduct = this.selectedProduct === product ? null : product;
  }

  increaseQty(product: CartProduct) {
    product.quantity++;
    this.cartService
      .addItemToCart(
        product.itemId,
        1,
        product.price,
        product.name,
        product.selectedColor,
        product.image,
        product.brandId
      )
      .subscribe({
        next: (response) => {
          console.log('Item added successfully:', response);
        },
        error: (error) => {
          console.error('Error adding item to cart:', error);
        },
      });
  }

  decreaseQty(product: CartProduct) {
    if (product.quantity > 1) {
      product.quantity--; // Optimistic UI update
      this.cartService
        .addItemToCart(
          product.itemId,
          -1,
          product.price,
          product.name,
          product.selectedColor,
          product.image,
          product.brandId
        )
        .subscribe({
          next: (response) => {
            console.log('Item decreased successfully:', response);
          },
          error: (error) => {
            console.error('Error decreasing item quantity:', error);
            product.quantity++; // Rollback on error
          },
        });
    } else {
      this.removeProduct(product);
    }
  }

  removeProduct(product: CartProduct) {
    this.cartService.removeItemFromCart(product.itemId).subscribe({
      next: (response) => {
        console.log('Product removed successfully:', response);
        this.cartProducts = this.cartProducts.filter(
          (p) => p.itemId !== product.itemId
        );
      },
      error: (error) => {
        console.error('Error removing product:', error);
      },
    });
  }
}
