import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-orders',
  imports: [CommonModule],
  templateUrl: './admin-orders.component.html'
})
export class AdminOrdersComponent {
 Play:boolean = true;

 Toggle(){
    return this.Play=!this.Play;
 }
 View(){
  
 }
}
