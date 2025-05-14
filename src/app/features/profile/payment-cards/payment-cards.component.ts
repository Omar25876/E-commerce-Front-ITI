import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { StorageService } from '../../../services/storage.service';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthInterceptor } from '../../../services/auth.interceptor';

@Component({
  selector: 'app-payment-cards',
  providers: [AccountService,{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },],
  imports: [RouterModule, HttpClientModule,CommonModule],
  templateUrl: './payment-cards.component.html',
  styles: ``
})
export class PaymentCardsComponent implements OnInit {
  data: any;

    constructor(
      private myProfile: AccountService,
      private storage: StorageService
    ) {}

    ngOnInit() {
      this.myProfile.getProfile().subscribe({
        next: (res) => {
          console.log(res);
          this.storage.setItem('cards', res.user.paymentCards);
          console.log(res.user.paymentCards);
          this.data = res.user.paymentCards;
        },
        error: (err) => {
          console.log(err);
        }
      });
      // Optionally, load from storage if needed:
      this.data = this.storage.getItem('cards');
    }
}
