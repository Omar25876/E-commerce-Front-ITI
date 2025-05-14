import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  selectedPayment: string = 'Confuse';
  selectedDelivery: string = '50';
  Promo : string ='';
  PromoCheck : boolean =false;
  Clicked:boolean=false;
  prdWithStock: any[] = [];
  cartTotal: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.prdWithStock$.subscribe((data) => {
      this.prdWithStock = data;
      this.cartTotal = this.cartService.getCartTotal(data);
    });
  }

  AppyPromo() {
     this.Clicked = true;
     this.PromoCheck = this.Promo === "SoundJoy100";
  }
  GetTotal():number{
    if(this.PromoCheck &&this.Clicked&&this.Promo.length>0)
      return this.cartTotal+parseInt(this.selectedDelivery.replace(/\D/g, ''), 10)-parseInt(this.Promo.replace(/\D/g, ''), 10);
    return (this.cartTotal+parseInt(this.selectedDelivery.replace(/\D/g, ''), 10));
  }
}
