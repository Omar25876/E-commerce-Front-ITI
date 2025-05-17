import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  imports: [CommonModule],
  templateUrl: './admin-orders.component.html'
})
export class AdminOrdersComponent implements OnInit  {
 Play:boolean = true;
Users:any[]=[];
Orders:any;

 constructor(private userService:UserService , private OrderSer:OrderService){}
 ngOnInit(): void {
   this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.Users = data.users;
        console.log(this.Users);
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
   this.OrderSer.getAllOrders().subscribe({
      next: (data) => {
        this.Orders=data.orders;
        console.log(this.Orders);
      },
      error: (err) => {
        console.error('Error fetching Orders:', err);
      }
    });
 }
 Toggle(){
    return this.Play=!this.Play;
 }
 View(){
  
 }

}
