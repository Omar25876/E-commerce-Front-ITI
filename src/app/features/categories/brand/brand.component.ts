import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ProductCardComponent } from '../../../Shared/Components/product-card/product-card.component';
import { Product } from '../../../models/productModel';
import { RouterModule } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import { Brand } from '../../../models/brandModel';

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
    ProductCardComponent ,
    RouterModule
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
  ]
  
  isLoading:boolean=true

  constructor(private productservice:ProductService){}
  ngOnInit(): void {
    this.productservice.getAllProductsbyFilters().subscribe({
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
