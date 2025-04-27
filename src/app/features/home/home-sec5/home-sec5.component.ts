import { Component } from '@angular/core';
import { ProductCardComponent } from "../../../Shared/Components/product-card/product-card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-sec5',
  imports: [ProductCardComponent,CommonModule],
  templateUrl: './home-sec5.component.html',
  styleUrl: './home-sec5.component.css'
})
export class HomeSec5Component {
productList = [
  {
    "name": "Wireless Headphones",
    "rate": 4.8,
    "price": "$129.99",
    "numberOfReviews": 120
  },
  {
    "name": "Bluetooth Speaker",
    "rate": 4.5,
    "price": "$89.99",
    "numberOfReviews": 85
  },
  {
    "name": "Smart Watch",
    "rate": 4.7,
    "price": "$199.99",
    "numberOfReviews": 150
  },
  {
    "name": "Gaming Mouse",
    "rate": 4.6,
    "price": "$49.99",
    "numberOfReviews": 60
  },
  {
    "name": "4K Monitor",
    "rate": 4.9,
    "price": "$399.99",
    "numberOfReviews": 200
  },
  {
    "name": "Mechanical Keyboard",
    "rate": 4.4,
    "price": "$79.99",
    "numberOfReviews": 95
  },
  {
    "name": "Noise Cancelling Earbuds",
    "rate": 4.7,
    "price": "$149.99",
    "numberOfReviews": 110
  },
  {
    "name": "Portable Charger",
    "rate": 4.3,
    "price": "$29.99",
    "numberOfReviews": 70
  },
  {
    "name": "Fitness Tracker",
    "rate": 4.5,
    "price": "$99.99",
    "numberOfReviews": 130
  },
  {
    "name": "Drone with Camera",
    "rate": 4.8,
    "price": "$499.99",
    "numberOfReviews": 50
  }
]

}
