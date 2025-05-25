import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../models/productModel';
import { ProductService } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from "../../../Shared/Components/product-card/product-card.component";
import { RouterModule } from '@angular/router';
interface sections{
  img:string,
  title:string
}
@Component({
  selector: 'app-all',
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ProductCardComponent,
    RouterModule
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
    {img:this.Images[0],title:'Over Ear'},
    {img:this.Images[1],title:'On Ear'},
    {img:this.Images[2],title:'In Ear'},
    {img:this.Images[3],title:'Speaker Ear'},

  ]

  AllPRoduct:Product[]=[
  ]
  isLoading:boolean=true;

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
