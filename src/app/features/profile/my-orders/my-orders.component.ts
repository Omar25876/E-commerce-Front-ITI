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
    private Auth: AuthService
  ) {
    this.user = Auth.getUserData();
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

  getStatusClass(status: string | null | undefined): string {
    switch (status) {
      case 'Canceled':
        return 'bg-gradient-to-r from-red-400 to-red-600 text-white';
      case 'Pending':
        return 'bg-gradient-to-r from-sky-400 to-blue-600 text-white';
      case 'Complete':
        return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
      default:
        return 'bg-gray-200 text-gray-600'; // fallback class
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
