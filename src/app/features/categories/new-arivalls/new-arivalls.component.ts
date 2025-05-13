import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../../services/product.service';
import { ProductCardComponent } from "../../../Shared/Components/product-card/product-card.component";
import { Product } from '../../../models/productModel';

@Component({
  selector: 'app-new-arivalls',
  standalone:true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    ProductCardComponent,
    RouterModule
],
  providers:[ProductService],
  templateUrl: './new-arivalls.component.html',
  styles: ``
})

export class NewArivallsComponent implements OnInit{

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
