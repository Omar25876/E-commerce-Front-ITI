import { Component, OnInit } from '@angular/core';
import { SlidarComponent } from "./slidar/slidar.component";
import { NewArivallsComponent } from "./new-arivalls/new-arivalls.component";
import { AllComponent } from "./all/all.component";
import { BrandComponent } from "./brand/brand.component";
import { NavigationEnd, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    SlidarComponent,
    NewArivallsComponent,
    AllComponent,
    BrandComponent,
    RouterModule,
    CommonModule,
    FormsModule,
    HttpClientModule
],
  templateUrl: './categories.component.html',
  styles: ``
})
export class CategoriesComponent{
}
