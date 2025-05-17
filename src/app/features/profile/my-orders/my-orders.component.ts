import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { StorageService } from '../../../services/storage.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Order } from '../../../models/orderModel';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-my-orders',
  providers: [OrderService, StorageService],
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './my-orders.component.html',
  styles: ``,
})
export class MyOrdersComponent implements OnInit {
  user: any;
  selectedOrderId: string | null = null;
  selectedOrder: Order | null = null;

  constructor(
    private orderService: OrderService,
    private storage: StorageService,
    private Auth : AuthService
  ) {
    this.user=Auth.getUserData();
    console.log(this.user);
  }

  myOrders: any[] | null = [];

  ngOnInit(): void {
    console.log(this.user);
    this.orderService.getAllOrdersByUserId(this.user?.id).subscribe({
      next: (data) => {
        this.storage.setItem('orders', data.orders);
        this.myOrders = data.orders;
        console.log('Success', data.orders);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.myOrders = this.storage.getItem('orders');
  }

  onOrderSelect(): void {
    if (this.selectedOrderId) {
      this.selectedOrder = this.myOrders?.find(
        (order) => order.orderId === this.selectedOrderId
      );
    }
  }
  getSavings(): number | null {
  if (
    this.selectedOrder?.totalAmount != null &&
    this.selectedOrder?.AfterSale != null
  ) {
    return this.selectedOrder.totalAmount - this.selectedOrder.AfterSale;
  }
  return null;
}

}
