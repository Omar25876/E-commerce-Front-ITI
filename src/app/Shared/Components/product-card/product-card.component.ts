import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styles: ''
})
export class ProductCardComponent {
  @Input() myProduct:{name:string,rate:number,price:string,numberOfReviews:number}={
    name: '',
    rate: 0,
    price: '',
    numberOfReviews: 0
  };

}
