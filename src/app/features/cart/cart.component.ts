import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartProduct } from '../../models/cartModel';
import { BrandService } from '../../services/brand.service';
import { ProductService } from '../../services/product.service';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink,RouterOutlet],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cartProducts: CartProduct[] = [];
  selectedProduct: CartProduct | null = null;
  userData: any;
  prd = {
    _id: '',
    stock: 0,
  };
  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private brandService: BrandService
  ) {}

  prdWithStock: {
    product: CartProduct;
    stock: number;
    isOutOfStock: boolean;
  }[] = [];

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedProduct = localStorage.getItem('product');
      console.log('localstorage: ', storedProduct);
    }
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cartProducts = data;
        this.cartProducts.forEach((product) => {
          this.brandService.getBrandById(product.brandId).subscribe((brand) => {
            product.brand = brand.name;
          });

          this.productService.getProductById(product.itemId).subscribe({
            next: (productOriginal) => {
              const stock = productOriginal.stock;
              const isOutOfStock = stock <= product.quantity;
              this.prdWithStock.push({ product, stock, isOutOfStock });
              console.log('this.prdWithStock', this.prdWithStock);
            },
          });
        });
        this.cartProducts = [];
      },
    });
  }

  getRemainingInStock(product: any) {
    const item = this.prdWithStock.find(
      (prd) => prd.product.itemId === product.itemId
    );
    if (item) {
      item.isOutOfStock = item.stock <= item.product.quantity;
      console.log(item);
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

  increaseQty(item: any) {
    item.product.quantity++;
    this.cartService
      .addItemToCart(
        item.product.itemId,
        1,
        item.product.price,
        item.product.name,
        item.product.selectedColor,
        item.product.image,
        item.product.brandId
      )
      .subscribe({
        next: (response) => {
          // console.log('Item added successfully:', response);
          this.getRemainingInStock(item.product);
        },
        error: (error) => {
          console.error('Error adding item to cart:', error);
        },
      });
  }

  decreaseQty(item: any) {
    this.getRemainingInStock(item.product);
    if (item.product.quantity > 1) {
      item.product.quantity--;
      this.cartService
        .addItemToCart(
          item.product.itemId,
          -1,
          item.product.price,
          item.product.name,
          item.product.selectedColor,
          item.product.image,
          item.product.brandId
        )
        .subscribe({
          next: (response) => {
            // console.log('Item decreased successfully:', response);
            this.getRemainingInStock(item.product);
          },
          error: (error) => {
            console.error('Error decreasing item quantity:', error);
          },
        });
    } else {
      this.removeProduct(item);
    }
  }

  removeProduct(item: any) {
    this.getRemainingInStock(item.product);
    this.cartService.removeItemFromCart(item.product.itemId).subscribe({
      next: (response) => {
        console.log('Product removed successfully:', response);
        this.prdWithStock = this.prdWithStock.filter(
          (p) => p.product.itemId !== item.product.itemId
        );
      },
      error: (error) => {
        console.error('Error removing product:', error);
      },
    });
  }
}
