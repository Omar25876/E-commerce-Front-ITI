import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ProductCardComponent } from '../../../Shared/Components/product-card/product-card.component';
import { Product } from '../../../models/productModel';

// interface productInformation{
//   name:string,
//   rate:number,
//   price:number,
//   numberOfReviews:number,
//   images:string[]
  
//   }
  interface Brandss{
    img:string,
    title:string
  }
@Component({
  selector: 'app-brand',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ProductCardComponent 
  ],
  providers:[ProductService],
  templateUrl: './brand.component.html',
  styles: ``
})
export class BrandComponent implements OnInit {

  Images=["Images/Cat-Page/Brands/JBL.png","Images/Cat-Page/Brands/Bose.png","Images/Cat-Page/Brands/Sony.png","Images/Cat-Page/Brands/Samsung.png"]
  
  @Input() brand:Brandss={
    img:'',
    title:''
  }
  AllSections:Brandss[]=[
    {img:this.Images[0],title:'JPL'},
    {img:this.Images[1],title:'Bose'},
    {img:this.Images[2],title:'Sony'},
    {img:this.Images[3],title:'Samsung'},

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
  isLoading:boolean=true

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
  // loadproduct():void{
  //   this.productservices.getAllProductsbyFilters().subscribe((products)=>{
  //     this.AllPRoduct=products.map(product=>({
  //       name:product.name,
  //       rate:product.rating,
  //       price:product.price,
  //       numberOfReviews:product.reviewsCount,
  //       images:product.images
  //     }));
  //     this.isLoading=false;
  //   },
  //   (error)=>{
  //     console.error('Error loading products', error);
  //     this.isLoading = false;
  //   }
  
  // )
  // }
  GoTO(){

  }
}
