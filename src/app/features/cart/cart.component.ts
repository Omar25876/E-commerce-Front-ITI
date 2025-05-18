import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import gsap from 'gsap';
import { CartService } from '../../services/cart.service';
import { CartProduct } from '../../models/cartModel';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit, AfterViewInit {
  @ViewChild('pageWrapper') pageWrapper!: ElementRef;
  @ViewChildren('cartItem') cartItemElements!: QueryList<ElementRef>;

  cartItems: CartProduct[] = [];
  selectedItem: CartProduct | null = null;

  constructor(
    private cartService: CartService,
    private Storage: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  ngAfterViewInit(): void {
    // Entry animation for the whole page
    gsap.from(this.pageWrapper.nativeElement, {
      duration: 1,
      y: 50,
      opacity: 0.3,
      ease: 'power3.out',
    });

    // Animate each cart item
    this.animateCartItems();
  }

  animateCartItems(): void {
    if (this.cartItemElements?.length) {
      gsap.from(this.cartItemElements.map(ref => ref.nativeElement), {
        duration: 1,
        y: 30,
        opacity: 0.3,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartFromLocalStorage();
    console.log(this.cartItems);
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }

  selectItem(item: CartProduct): void {
    this.selectedItem = this.selectedItem === item ? null : item;
  }

  increaseQuantity(item: CartProduct): void {
    this.cartService.addItemToCart(
      item.itemId,
      1,
      item.price,
      item.name,
      item.selectedColor,
      item.image,
      item.brand,
      item.stock
    );
    this.loadCart();
  }

  decreaseQuantity(item: CartProduct): void {
    if (item.quantity > 1) {
      this.cartService.addItemToCart(
        item.itemId,
        -1,
        item.price,
        item.name,
        item.selectedColor,
        item.image,
        item.brand,
        item.stock
      );
      this.loadCart();
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: CartProduct): void {
    this.cartService.removeItemFromCart(item.itemId, item.selectedColor);
    this.cartItems = this.cartItems.filter(
      (i) => !(i.itemId === item.itemId && i.selectedColor === item.selectedColor)
    );
  }

  trackByItemId(index: number, item: CartProduct): string {
    return item.itemId;
  }

  navigateWithAnimation(url: string) {
    gsap.to(this.pageWrapper.nativeElement, {
      duration: 0.5,
      y: -50,
      opacity: 0.3,
      ease: 'power3.in',
      onComplete: () => {
        this.router.navigateByUrl(url);
      },
    });
  }
}
