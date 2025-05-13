import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule,FormsModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  selectedPayment: string = 'Confuse';
}
