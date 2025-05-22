import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { UserService } from '../../../services/user.service';
import { OrderService } from '../../../services/order.service';
import { SharingUserService } from '../../../services/SharingUser.service';
import { User } from '../../../models/userModel';
import { Order,OrderItem } from '../../../models/orderModel';
import { MessageService } from '../../../services/message.service';
import { FormsModule } from '@angular/forms';

interface MyItem {
  Brand: string;
  Image: string;
  name: string;
  quantity: number;
  price: number;
  SelectedColor: string;
}

interface MyOrder {
  _id:string;
  orderId: number;
  Status: string;
  DeliveyType: string;
  totalAmount: number;
  PromoCode: string;
  AfterSale: number;
  items: MyItem[];
}

interface AccountUser {
  email: string;
  Orders: MyOrder[];
  IsOpen?: boolean;
}

@Component({
  selector: 'app-admin-orders',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-orders.component.html'
})

export class AdminOrdersComponent implements OnInit  {

Users:User[]=[];
Orders:Order[]=[];
SendUser:any;
AccountUsers: AccountUser[]=[];
SearchAccounts:AccountUser[]=[];
statuses = ['pending', 'processing', 'shipped', 'delivered'];


 constructor(
  private userService:UserService , 
  private OrderSer:OrderService,
  private SharingUs:SharingUserService,
  private MsgSer:MessageService
){}
 ngOnInit(): void {
   this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.Users = data.users;
      },
      error: (err) => {
        this.MsgSer.show("Error Fetching Users");
        console.error('Error fetching users:', err);
      }
    });
   this.OrderSer.getAllOrders().subscribe({
      next: (data) => {
        this.Orders=data.orders;
        this.HandleData();

      },
      error: (err) => {
        this.MsgSer.show("Error Fetching Users");
        console.error('Error fetching Orders:', err);
      }
    });
 }
 HandleData(){
  for(let i=0;i<this.Users.length;i++){
    let TempOrders=[];
    for(let j=0;j<this.Orders.length;j++){
      if(this.Users[i]._id === this.Orders[j].userId?._id && !this.Users[i].isAdmin){
        
        let tempItems = [...this.Orders[j].items];

        if(!this.statuses.includes(this.Orders[j].Status.toLowerCase()))
          this.Orders[j].Status='pending';

        let tempOrder = {
          _id:this.Orders[j]._id,
          orderId:this.Orders[j].orderId,
          Status:this.Orders[j].Status.toLocaleLowerCase(),
          DeliveyType:this.Orders[j].DeliveyType,
          items:tempItems,
          totalAmount:this.Orders[j].totalAmount,
          AfterSale:this.Orders[j].AfterSale,
          PromoCode:this.Orders[j].PromoCode
        };
        TempOrders.push(tempOrder); 
      }

    }
    if(TempOrders.length>0)
      this.AccountUsers.push({ email:this.Users[i].email,Orders:TempOrders,IsOpen:false});
  }
  console.log(this.AccountUsers);
  this.SearchAccounts=[...this.AccountUsers];

 };
 SendOrder(order:MyOrder){
  this.SharingUs.setUser(order);
  this.SharingUs.setIsPressed(true);
 }
 SearchResult(event:Event){
  const input = event.target as HTMLInputElement;
  const val = input.value.toLowerCase();
  this.SearchAccounts = this.AccountUsers.filter(user =>user.email.toLowerCase().startsWith(val));
}
SaveStatus(order:MyOrder){
  this.OrderSer.updateOrder(order._id.toString(), {"_id":order.Status,"Status":order.Status}).subscribe({
    next: (response) => {
      console.log('Order updated successfully:', response);
      this.MsgSer.show("Order Updated Successfully");
    },
    error: (error) => {
      console.error('Failed to update order:', error);
    }
  });
}
DeleteOrder(order:MyOrder){
  this.OrderSer.deleteOrder(order._id.toString()).subscribe({
    next:(res)=>{
      console.log("Order Deleted Successfully");
      this.MsgSer.show("Order Deleted Successfully");
      // Removing it From AccountUsers
      for (const user of this.AccountUsers) {
        const index = user.Orders.findIndex(o => o._id === order._id);
        if (index !== -1) {
          user.Orders.splice(index, 1);
          break; 
        }
      }
      // Also Removing it From SearchUsers
      for (const user of this.SearchAccounts) {
        const index = user.Orders.findIndex(o => o._id === order._id);
        if (index !== -1) {
          user.Orders.splice(index, 1);
          break; 
        }
      }

    },
    error:(error)=>{
       console.error('Failed To Delete Order:', error);
    }
  })
}

}
