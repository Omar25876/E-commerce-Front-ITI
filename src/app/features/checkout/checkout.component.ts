import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { MessageService } from '../../services/message.service';
import { AccountService } from '../../services/account.service';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { PromoCodeService } from '../../services/PromoCode.service';
import { PromoCode } from '../../models/PromoCodeModel';
import { OrderService } from '../../services/order.service';
import { CartProduct } from '../../models/cartModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  selectedPayment: string = "Confuse";
  selectedDelivery: string = '50';
  AddClicked:boolean=false;
  CardBut:string='ADD';
  
  Promo : string ='';
  PromoCheck : boolean =false;
  Clicked:boolean=false;
  DBPromos:PromoCode[]=[];

  prdWithStock: CartProduct[]=[] ;
  cartTotal: number = 0;
  HasAddressBool:boolean =false;

  CardIndex:number=0;
  cardsdata:any[]=[];
  DBcardsNum:number=0;
  CurrentCard: {
    cardNumber: string;
    cvv: string;
    expiryDate: string;
    cardHolderName: string;
  } = {
    cardNumber: "0000 0000 0000 0000",
    expiryDate: "00/00",
    cvv: "000",
    cardHolderName: "Enter Your Name"
  };

 Order:any;
 user: any;

  constructor(
    private cartService: CartService,
    private MessageSer:MessageService,
    private myProfile: AccountService,
    private storage: StorageService,
    private Auth : AuthService,
    private promoService:PromoCodeService,
    private orderService:OrderService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.prdWithStock=this.cartService.getCartFromLocalStorage()
    this.cartTotal=this.cartService.getCartTotal();

    this.myProfile.getProfile().subscribe({
        next: (res) => {
          this.storage.setItem('cards', res.user.paymentCards);
          this.cardsdata=res.user.paymentCards.slice();
          this.DBcardsNum=this.cardsdata.length; // holds the cards number before adding
        },
        error: (err) => {
          console.log(err);
        }
      });
      
     this.promoService.getAllPromoCodes().subscribe({
        next: (data) => {
          this.DBPromos = data;
        },
        error: (err) => {
          console.error('Error fetching promo codes:', err);
        }
      });
    this.user = this.Auth.getUserData();
    this.HasAAddress();
  }

  ApplyPromo() {
     this.Clicked = true;
     this.PromoCheck = this.DBPromos.some(item => item.code === this.Promo);
  }
  GetTotal():number{
    let result;
    if(this.PromoCheck &&this.Clicked&&this.Promo.length>0)
      result = this.cartTotal+ parseInt(this.selectedDelivery.replace(/\D/g, ''), 10)
              - ((parseInt(this.Promo.replace(/\D/g, ''), 10) * this.cartTotal) / 100);
    
    else 
      result = (this.cartTotal+parseInt(this.selectedDelivery.replace(/\D/g, ''), 10));
    
    return parseFloat(result.toFixed(2));
  }
  HasAAddress(){
    
    let temp = {
        city: this.user.address.city,
        street: this.user.address.street,
        buildingNumber: this.user.address.buildingNumber,
        apartmentNumber: this.user.address.apartmentNumber
      };

     this.HasAddressBool = Object.values(temp).every(
      (value) => value !== null && value !== undefined && value !== ''
      );
  }
  Checkout(){
    if(this.selectedPayment=="Confuse")
      {
        this.MessageSer.show("Choose Your Payment Type First");
        return
      }
    
    if(this.AddClicked && this.selectedPayment=="stripe")
      {
        this.MessageSer.show("Save Your Payment Card First");
        return;
      }

    if(!this.HasAddressBool)
      {
        this.MessageSer.show("Save Your Address First");
        return;
      }

      //Preparing The Order Template

      const transformedKeys = this.prdWithStock.map(({ itemId,brand,image,selectedColor, ...rest }) => ({
          _id: itemId,
          Brand:brand,
          Image:image,
          SelectedColor:selectedColor,
          ...rest
        }));
        let promoused = this.PromoCheck ? this.Promo : '';
        let Delivery = (this.selectedDelivery =="50") ? "Fast Delivery - 50 EGP" : "Standard Delivery - 30 EGP";
        this.Order={
          userId:this.user.id,
          shippingAddress:this.user.address,
          Status:"pending",
          DeliveyType:Delivery,
          items:transformedKeys,
          totalAmount:this.cartTotal+parseInt(this.selectedDelivery.replace(/\D/g, ''), 10),
          AfterSale:this.GetTotal(),
          PromoCode:promoused,
          paymentMethod:this.selectedPayment,
        }

    if(!this.AddClicked && this.HasAddressBool && this.selectedPayment=="stripe")
      {
        // Checking If User Has Add Cards
        if(this.cardsdata.length>this.DBcardsNum) 
        {
          let addedCards = this.cardsdata.slice((this.cardsdata.length-this.DBcardsNum)*-1);
           this.myProfile.updateProfile({ paymentCards: addedCards }).subscribe({
            next: () => {
              this.MessageSer.show('Cards updated successfully');
            },
            error: (err) => {
              console.error('Failed to update cards:', err);
              this.MessageSer.show('Failed to update cards');
            }
          });
        }
      // Posting Order To DataBase
        this.orderService.addOrder(this.Order).subscribe({
        next: (res) => {
          this.MessageSer.show("Order Added Successfully");
          this.cartService.EmptyCart();
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.MessageSer.show("Failed To Place Order,See Console For More Details");
          console.error('Failed to place order:', err);
        }
      });
        
      }
      if(this.HasAddressBool && this.selectedPayment=="cash")
      {
        // Posting Order To DataBase
        this.orderService.addOrder(this.Order).subscribe({
        next: (res) => {
          this.MessageSer.show("Order Added Successfully");
          this.cartService.EmptyCart();
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.MessageSer.show("Failed To Place Order,See Console For More Details");
          console.error('Failed to place order:', err);
        }
      });
        
      }
  }
  Prev(){
    if(this.cardsdata?.length!=0){
     
      if(!this.AddClicked)
      {
        if(this.CardIndex>0){
          this.CardIndex--;
          this.MessageSer.show(`Card ${this.CardIndex+1}`);
          this.CurrentCard={...this.cardsdata[this.CardIndex]};
        }
        else
          this.MessageSer.show("No Previous Cards");
      }
      else
        this.MessageSer.show("Please Save Your Current Card First");
    }
    else
      this.MessageSer.show("Sorry, you Don't Have Any Saved Cards");
  }
  Next(){
    if(this.cardsdata?.length!=0)
     {
        if(!this.AddClicked)
        {
          if(this.CardIndex<this.cardsdata.length-1){
            this.CardIndex++;
            this.MessageSer.show(`Card ${this.CardIndex+1}`);
            this.CurrentCard={...this.cardsdata[this.CardIndex]};
          }
         else
           this.MessageSer.show("No Next Cards");
        }
        else
          this.MessageSer.show("Please Save Your Current Card First");

      }
    
    else
      this.MessageSer.show("Sorry, you Don't Have Any Saved Cards");
  }
  ADD(){
    if(this.CardBut==="ADD")
    {
      if(this.cardsdata?.length<4)
      {
        this.CurrentCard = {  // create a fresh object here
        cardHolderName: "Enter Your Name Here",
        cardNumber: "0000 0000 0000 0000",
        cvv: "000",
        expiryDate: "00/00",
        };
        setTimeout(() => {
            this.CardBut="Save";
          }, 500);
        this.AddClicked=true;
      }
      else
        this.MessageSer.show("Sorry,You Can't Add More than 4 Cards");
      
    }
    if(this.CardBut==="Save")
    {
        if(
            this.CurrentCard.expiryDate=="00/00" 
            || this.CurrentCard.cvv=="000" 
            || this.CurrentCard.cardNumber=="0000 0000 0000 0000"
            || this.CurrentCard.cardHolderName=="Enter Your Name Here"
            || this.CurrentCard.expiryDate.length !=5
            || this.CurrentCard.cardNumber.length !=19
            || this.CurrentCard.cvv.length !=3
          )
          {this.MessageSer.show("Fill All Required Fields");}
        
        else{
            this.CurrentCard.cardNumber = this.CurrentCard.cardNumber.split(' ').join('');
            this.CurrentCard.cardHolderName=this.CurrentCard.cardHolderName.trim();
            this.AddClicked=false;
            this.CardBut="ADD";

            if(this.cardsdata.length==0)
              {
                this.cardsdata=[{...this.CurrentCard}];
              }
            else
              {
                this.cardsdata.push({...this.CurrentCard});
                this.CardIndex++;
              }
          
          this.MessageSer.show("Card Saved Successfully");
          }

    }

}

  FRestrict(event: Event) {
    const input = event.target as HTMLInputElement;
    const inputName = input.name;

    if (inputName === 'CardNum') {

      let value = input.value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(.{4})/g, '$1 ').trim();
      this.CurrentCard.cardNumber = value;
      input.value = value;
    } 
    if (inputName === 'CVV') {

      let value = input.value.replace(/\D/g, '').slice(0, 3);
      this.CurrentCard.cvv = value;
      input.value = value;
    }
    
    if (inputName === 'Expiry') {
    let value = input.value.replace(/\D/g, '').slice(0, 4); // Max 4 digits
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
      
      // Handle Month Min
      if(value.includes("00"))
          value=value.replace("00","01");
      
      // Handle Month Max
      let temp = value.substr(0,2);
      if(parseInt(temp) >12)
          value= value.replace(temp,"12");
    }
    //Handle Year Min
    if(value.length==5)
    {
      let temp = value.substring(3,5);
      if(parseInt(temp)<26)
        value= value.replace(temp,"26");
    }
    
    this.CurrentCard.expiryDate = value;
    input.value = value;
  }

  if (inputName === 'HolderName') {
    
    let value = input.value.replace(/[^a-zA-Z\s]/g, '');
    this.CurrentCard.cardHolderName = value;
    input.value = value;
  }

  }

  SaveAddress(){
    this.HasAddressBool =true;
    this.MessageSer.show("Address Saved Correctly");
  }
  SetPaymentView(){
    if(this.selectedPayment =="stripe")
    {
     
      if(this.cardsdata?.length==0)
        this.ADD();
      else
      this.CurrentCard=this.cardsdata[0];
    }
}


}
