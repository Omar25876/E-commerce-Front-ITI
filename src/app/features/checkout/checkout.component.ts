import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { MessageService } from '../../services/message.service';
import { AccountService } from '../../services/account.service';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/userModel';
import { PaymentCard } from '../../models/profileModel';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  selectedPayment: string = 'Confuse';
  selectedDelivery: string = '50';
  CardBut:string='ADD';
  Promo : string ='';
  PromoCheck : boolean =false;
  Clicked:boolean=false;
  prdWithStock: any;
  cartTotal: number = 0;
  CardIndex:number=0;
  cardsdata:any;
  CurrentCard:any;
  user:any;

  constructor(
    private cartService: CartService,
    private MessageSer:MessageService,
    private myProfile: AccountService,
    private storage: StorageService,
    private Auth : AuthService
  ) {}

  ngOnInit(): void {
    this.cartService.prdWithStock$.subscribe((data) => {
      this.prdWithStock = data;
      this.cartTotal = this.cartService.getCartTotal(data);
    });
     this.myProfile.getProfile().subscribe({
        next: (res) => {
          this.storage.setItem('cards', res.user.paymentCards);
          console.log("Payment cards");
          this.cardsdata=res.user.paymentCards;
          console.log(this.cardsdata);
          this.CurrentCard=this.cardsdata[0];
          console.log("CurrentCard :");
          console.log(this.CurrentCard);
          
        },
        error: (err) => {
          console.log(err);
        }
      });
      this.user = this.Auth.getUserData();
      
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
  HasAAddress(){
     
    return Object.values(this.user.address).every(
      (value) => value !== null && value !== undefined && value !== ''
      );
    
  }
  Checkout(){
    console.log(this.HasAAddress());
    this.MessageSer.show("Sorry , Still Working On it Bro 😁");
  }
  Prev(){
    if(this.cardsdata!=null && this.cardsdata!=undefined){
      if(this.CardIndex>0){
        this.CardIndex--;
        this.MessageSer.show(`Card ${this.CardIndex+1}`);
        this.CurrentCard=this.cardsdata[this.CardIndex];
      }
      
      else{
        this.MessageSer.show("No Previous Cards");
      }
    }
    else{
      this.MessageSer.show("Sorry, you Don't Have Any Saved Cards");
    }
    
   
  }
  Next(){
    if(this.cardsdata!=null && this.cardsdata!=undefined)
     {
       if(this.CardIndex<this.cardsdata.length-1){
         console.log(this.cardsdata.length);
         this.CardIndex++;
         console.log(this.CardIndex);
         this.MessageSer.show(`Card ${this.CardIndex+1}`);
         this.CurrentCard=this.cardsdata[this.CardIndex];
       }
      else{
        this.MessageSer.show("No Next Cards");
      }
     }
    
    else{
      this.MessageSer.show("Sorry, you Don't Have Any Saved Cards");
    }
    
  }
}
