import { Component, OnInit } from '@angular/core';
import { SlidarComponent } from "./slidar/slidar.component";
import { NewArivallsComponent } from "./new-arivalls/new-arivalls.component";
import { AllComponent } from "./all/all.component";
import { BrandComponent } from "./brand/brand.component";
import { NavigationEnd, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-categories',
  imports: [
    SlidarComponent,
    NewArivallsComponent,
    AllComponent,
    BrandComponent,
    RouterModule,
    CommonModule,
    FormsModule
],
  templateUrl: './categories.component.html',
  styles: ``
})
export class CategoriesComponent implements OnInit {

  url:string=''

  constructor(private router: Router){}
  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.url = event.urlAfterRedirects;
      });
  }
  shouldShowMainSections(): boolean {
    return !this.router.url.includes('/categories/arrival') &&
           !this.router.url.includes('/categories/all') &&
           !this.router.url.includes('/categories/brands');
  }
  

}
