import { Component } from '@angular/core';
import { SlidarComponent } from "./slidar/slidar.component";
import { NewArivallsComponent } from "./new-arivalls/new-arivalls.component";
import { AllComponent } from "./all/all.component";
import { BrandComponent } from "./brand/brand.component";

@Component({
  selector: 'app-categories',
  imports: [
    SlidarComponent,
    NewArivallsComponent,
    AllComponent,
    BrandComponent
],
  templateUrl: './categories.component.html',
  styles: ``
})
export class CategoriesComponent {

}
