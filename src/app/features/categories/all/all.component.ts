import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../models/productModel';
import { ProductService } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from "../../../Shared/Components/product-card/product-card.component";
interface sections{
  img:string,
  title:string
}
// interface productInformation{
//   name:string,
//   rate:number,
//   price:number,
//   numberOfReviews:number
  
//   }
@Component({
  selector: 'app-all',
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ProductCardComponent
],
  providers:[ProductService],
  templateUrl: './all.component.html',
  styles: ``
})



export class AllComponent implements OnInit {

  Images=["Images/Cat-Page/OverEar.png","Images/Cat-Page/OnEar.png","Images/Cat-Page/InEar.png","Images/Cat-Page/Speaker.png"]
  
  @Input() section:any={
    img:'',
    title:''
  }
  AllSections:sections[]=[
    {img:this.Images[0],title:'Over Air'},
    {img:this.Images[1],title:'On Air'},
    {img:this.Images[2],title:'In Air'},
    {img:this.Images[3],title:'Speaker Air'},

  ]

  AllPRoduct:Product[]=[
    // { name: 'Product 1', price: 2500, rate: 4.5, numberOfReviews: 120 },
    // { name: 'Product 2', price: 1999, rate: 4.0, numberOfReviews: 90 },
    // { name: 'Product 3', price: 3000, rate: 5.0, numberOfReviews: 200 },
    // { name: 'Product 4', price: 1500, rate: 3.5, numberOfReviews: 75 },
    // { name: 'Product 5', price: 2800, rate: 4.8, numberOfReviews: 150 },
    // { name: 'Product 6', price: 2300, rate: 4.2, numberOfReviews: 60 },
    // { name: 'Product 7', price: 2100, rate: 4.7, numberOfReviews: 85 },
    // { name: 'Product 8', price: 3200, rate: 5.0, numberOfReviews: 300 },
    // { name: 'Product 9', price: 3200, rate: 5.0, numberOfReviews: 300 },
    // { name: 'Product 10', price: 3200, rate: 5.0, numberOfReviews: 300 },
  ]
  isLoading:boolean=true;
  // GoTO(){

  // }
  constructor(private productservices:ProductService){}
  ngOnInit(): void {
    this.productservices.getAllProductsbyFilters().subscribe({
      next:(data)=>{
        this.AllPRoduct=data;
        console.log('Success',data);
        this.isLoading=false;
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }
}
