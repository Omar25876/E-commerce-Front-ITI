import { Component } from '@angular/core';
import { PromoCode } from '../../../models/PromoCodeModel';
import { PromoCodeService } from '../../../services/PromoCode.service';
import { MessageService } from '../../../services/message.service';
import { Category } from '../../../models/categoryModel';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../../models/productModel';

@Component({
  selector: 'app-admin-add',
  imports: [CommonModule],
  templateUrl: './admin-add.component.html'
})
export class AdminAddComponent {
  
  PromoCode:PromoCode={
  _id: '',
  code: '',
  discountType: "percentage",
  discountValue: 0,
  expiryDate: '', 
  isActive: false,
  usageLimit: 0,
  usedCount: 0,
  createdAt: '',
  updatedAt: '',
};
MyProduct:Product={
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
  specs: {}, // specs as key-value pairs
  modelNumber: '',
  modelName: '',
  whatsInTheBox: [],
  isPopular: false,
  isNewArrival: false,
  isDiscover: false,
  category: '',
  brand: '',
  createdAt: '',
  updatedAt: ''
};
constructor(
  private PromoSer:PromoCodeService,
  private MsgSer:MessageService,
  private CateSer:CategoryService
){}
categories: Category[] = [];
selectedCategoryBrands: any[] = [];

ngOnInit() {
  this.getCategories();
}

getCategories() {
  this.CateSer.getAllCategories().subscribe({
    next: (res) => {
      this.categories = res;
      console.log("Categorties are :");
      console.log(this.categories);
    },
    error: (err) => {
      console.error('Error fetching categories:', err);
    }
  });
}

onCategoryChange(event:Event) {
 const selectedValue = (event.target as HTMLSelectElement).value;
  const category = this.categories.find(cat => cat.categoryName === selectedValue);
  this.selectedCategoryBrands = category ? category.brandNames : [];
  console.log(this.selectedCategoryBrands);
}


  PromoSave(){
    if(
      this.PromoCode.code.length==0 ||
      this.PromoCode.usageLimit==0 ||
      this.PromoCode.discountValue == 0 ||
      this.PromoCode.expiryDate.length == 0 
    )
    this.MsgSer.show("Please Fill In All Required Data First");
    else{
      let temp ={
        code:this.PromoCode.code,
        usageLimit:this.PromoCode.usageLimit,
        discountValue:this.PromoCode.discountValue,
        expiryDate:this.PromoCode.expiryDate,
        discountType:this.PromoCode.discountType
      };
          this.PromoSer.createPromoCode(temp).subscribe({
        next: (res) => {
          console.log('Promo code created successfully:', res);
          this.MsgSer.show("Promo code created successfully");
        },
        error: (err) => {
          console.error('Error creating promo code:', err);
        }
      });
    }

  }
  // Fields Listener to consume any wrong inputs --> still needs some work
  FVaildate(event:Event){
    const input = event.target as HTMLInputElement;
    const inputName = input.id;

    if (inputName === 'DiscountValue') {

      let value = input.value.replace(/\D/g, '').slice(0, 3);
      if(value.length==3)
        if(parseInt(value,10)>100)
          value="100";
      
      this.PromoCode.discountValue = parseInt(value,10);
      input.value = value;
    } 
    if (inputName === 'Limt') {
      let rawValue = input.value.replace(/\D/g, '').slice(0, 9);
      this.PromoCode.usageLimit = parseInt(rawValue || '0');
      input.value = Number(rawValue).toLocaleString();
    }

    
  if (inputName === 'Code') {
    const value = input.value.replace(/[^a-zA-Z0-9]/g, '');
    this.PromoCode.code = value;
    input.value = value;
  }

   if (inputName === 'expiryDate') {
  let raw = input.value.replace(/\D/g, '').slice(0, 8); // only digits, max 8 chars

  let day = raw.slice(0, 2);
  let month = raw.slice(2, 4);
  let year = raw.slice(4, 8);

  // Validate day
  if (day.length === 2) {
    let d = parseInt(day);
    if (d < 1) d = 1;
    if (d > 31) d = 31;
    day = d.toString().padStart(2, '0');
  }

  // Validate month
  if (month.length === 2) {
    let m = parseInt(month);
    if (m < 1) m = 1;
    if (m > 12) m = 12;
    month = m.toString().padStart(2, '0');
  }

  // Validate year (optional: set minimum to 2026)
  if (year.length === 4) {
    let y = parseInt(year);
    if (y < 2026) y = 2026;
    year = y.toString();
  }

  let formatted = day;
  if (month) formatted += `-${month}`;
  if (year) formatted += `-${year}`;

  this.PromoCode.expiryDate = formatted;
  input.value = formatted;
}


}

}
