import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface productInformation{
name:string,
rate:number,
price:number,
numberOfReviews:number

}
@Component({
  selector: 'app-new-arivalls',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './new-arivalls.component.html',
  styles: ``
})

export class NewArivallsComponent {
  @Input() myProduct:productInformation={
    name: 'Airpods',
    rate: 5,
    price: 150,
    numberOfReviews: 5
  };

  AllPRoduct:productInformation[]=[
    { name: 'Product 1', price: 2500, rate: 4.5, numberOfReviews: 120 },
    { name: 'Product 2', price: 1999, rate: 4.0, numberOfReviews: 90 },
    { name: 'Product 3', price: 3000, rate: 5.0, numberOfReviews: 200 },
    { name: 'Product 4', price: 1500, rate: 3.5, numberOfReviews: 75 },
    { name: 'Product 5', price: 2800, rate: 4.8, numberOfReviews: 150 },
    { name: 'Product 6', price: 2300, rate: 4.2, numberOfReviews: 60 },
    { name: 'Product 7', price: 2100, rate: 4.7, numberOfReviews: 85 },
    { name: 'Product 8', price: 3200, rate: 5.0, numberOfReviews: 300 },
    { name: 'Product 9', price: 3200, rate: 5.0, numberOfReviews: 300 },
    { name: 'Product 10', price: 3200, rate: 5.0, numberOfReviews: 300 },
  ]
}
