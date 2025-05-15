import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartProduct } from '../../models/cartModel';
import { BrandService } from '../../services/brand.service';
import { ProductService } from '../../services/product.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartProducts: CartProduct[] = [];
  selectedProduct: CartProduct | null = null;
  isLoading = true;
  userData: any;
  
  prdWithStock: {
    product: CartProduct;
    stock: number;
    isOutOfStock: boolean;
  }[] = [];

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private brandService: BrandService
  ) {}

  async ngOnInit(): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedProduct = localStorage.getItem('product');
    }
    await this.loadCartData();
  }

  async loadCartData(): Promise<void> {
    this.isLoading = true;
    try {
      const cartData = await firstValueFrom(this.cartService.getCart());
      this.cartProducts = cartData;
      
      // Clear previous data
      this.prdWithStock = [];
      
      // Process all cart items in parallel
      await Promise.all(this.cartProducts.map(async (product) => {
        const [brand, productOriginal] = await Promise.all([
          firstValueFrom(this.brandService.getBrandById(product.brandId)),
          firstValueFrom(this.productService.getProductById(product.itemId))
        ]);
        
        product.brand = brand.name;
        
        this.prdWithStock.push({
          product,
          stock: productOriginal.stock,
          isOutOfStock: productOriginal.stock <= product.quantity
        });
      }));
      
      this.cartService.setPrdWithStock(this.prdWithStock);
    } catch (error) {
      console.error('Error loading cart data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  getRemainingInStock(product: any) {
    const item = this.prdWithStock.find(
      (prd) => prd.product.itemId === product.itemId
    );
    if (item) {
      item.isOutOfStock = item.stock <= item.product.quantity;
    }
  }

  getCartTotal() {
    return this.prdWithStock.reduce((total, item) => {
      const price = item.product?.price || 0;
      const quantity = item.product?.quantity || 0;
      return total + price * quantity;
    }, 0);
  }

  selectProduct(product: any) {
    this.selectedProduct = this.selectedProduct === product ? null : product;
  }

  async increaseQty(item: any) {
    item.product.quantity++;
    try {
      await firstValueFrom(this.cartService.addItemToCart(
        item.product.itemId,
        1,
        item.product.price,
        item.product.name,
        item.product.selectedColor,
        item.product.image,
        item.product.brandId
      ));
      this.getRemainingInStock(item.product);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      item.product.quantity--; // Rollback on error
    }
  }

  async decreaseQty(item: any) {
    this.getRemainingInStock(item.product);
    if (item.product.quantity > 1) {
      item.product.quantity--;
      try {
        await firstValueFrom(this.cartService.addItemToCart(
          item.product.itemId,
          -1,
          item.product.price,
          item.product.name,
          item.product.selectedColor,
          item.product.image,
          item.product.brandId
        ));
        this.getRemainingInStock(item.product);
      } catch (error) {
        console.error('Error decreasing item quantity:', error);
        item.product.quantity++; 
      }
    } else {
      await this.removeProduct(item);
    }
  }

  async removeProduct(item: any) {
    this.getRemainingInStock(item.product);
    try {
      await firstValueFrom(this.cartService.removeItemFromCart(item.product.itemId));
      this.prdWithStock = this.prdWithStock.filter(
        (p) => p.product.itemId !== item.product.itemId
      );
      // Update cart products to reflect removal
      this.cartProducts = this.cartProducts.filter(
        (p) => p.itemId !== item.product.itemId
      );
    } catch (error) {
      console.error('Error removing product:', error);
    }
  }

  trackByItemId(index: number, item: any): string {
    return item.product.itemId;
  }
  show(){
    console.log("My PrdwithStock");
    console.log(this.prdWithStock);
  }
}