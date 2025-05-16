import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { MessageService } from '../../services/message.service';
import { AccountService } from '../../services/account.service';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  selectedPayment: string = 'Confuse';
  selectedDelivery: string = '50';
  AddClicked:boolean=false;
  CardBut:string='ADD';
  Promo : string ='';
  PromoCheck : boolean =false;
  Clicked:boolean=false;
  prdWithStock: any ;
  cartTotal: number = 0;
  CardIndex:number=0;
  cardsdata:any[]=[];
  DBcardsdata:any[]=[];
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

  user:any;

  constructor(
    private cartService: CartService,
    private MessageSer:MessageService,
    private myProfile: AccountService,
    private storage: StorageService,
    private Auth : AuthService
  ) {}

  ngOnInit(): void {
    this.prdWithStock=this.cartService.getCartFromLocalStorage()
    this.cartTotal=this.cartService.getCartTotal();

    this.myProfile.getProfile().subscribe({
        next: (res) => {
          this.storage.setItem('cards', res.user.paymentCards);
          this.DBcardsdata=res.user.paymentCards;
          this.cardsdata=this.DBcardsdata.slice();
          console.log("Payment cards");
          console.log(this.DBcardsdata);
          console.log(this.cardsdata);
          
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
    if(this.selectedPayment=="Confuse")
      {
        this.MessageSer.show("Choose Your Payment Type First");
        return
      }
    
    if(this.AddClicked && this.selectedPayment=="Credit")
      {
        this.MessageSer.show("Save Your Payment Card First");
        return;
      }

    if(!this.HasAAddress())
      {
        this.MessageSer.show("Save Your Address First");
        return;
      }
    if(!this.AddClicked && this.HasAAddress() && this.selectedPayment=="Credit")
      {
        this.MessageSer.show("Order Added Successfully");
        return
      }
      if(this.HasAAddress() && this.selectedPayment=="COD")
      {
        this.MessageSer.show("Order Added Successfully");
        return
      }
  }
  Prev(){
    if(this.cardsdata?.length!=0){
     
      if(!this.AddClicked)
      {
        if(this.CardIndex>0){
          this.CardIndex--;
          this.MessageSer.show(`Card ${this.CardIndex+1}`);
          this.CurrentCard=this.cardsdata[this.CardIndex];
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
            this.CurrentCard=this.cardsdata[this.CardIndex];
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
        this.CurrentCard.cardHolderName="Enter Your Name Here";
        this.CurrentCard.cardNumber="0000 0000 0000 0000";
        this.CurrentCard.cvv="000";
        this.CurrentCard.expiryDate="00/00";
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
                console.log("First IF");
                this.cardsdata=[{...this.CurrentCard}];
              }
            else
              {
                console.log("Second IF"); 
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
    this.MessageSer.show("Address Saved Correctly");
  }
  SetPaymentView(){
    if(this.selectedPayment =="Credit")
    {
     
      if(this.cardsdata?.length==0)
        this.ADD();
      else
      this.CurrentCard=this.cardsdata[0];
    }
}


}
