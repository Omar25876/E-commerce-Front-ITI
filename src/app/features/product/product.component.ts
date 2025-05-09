import { Component, OnInit } from '@angular/core';
import { ProductSec1Component } from "./product-sec1/product-sec1.component";
import { ProductSec2Component } from "./product-sec2/product-sec2.component";
import { ProductSec3Component } from "./product-sec3/product-sec3.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-product',
  imports: [ProductSec1Component, ProductSec2Component, ProductSec3Component,HttpClientModule],
  templateUrl: './product.component.html',
  styles: ``
})
export class ProductComponent  {


}
