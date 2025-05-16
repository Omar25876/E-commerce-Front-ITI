import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { StorageService } from '../../../services/storage.service';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthInterceptor } from '../../../services/auth.interceptor';
import { EditablePaymentCard, PaymentCard } from '../../../models/profileModel';
import { MessageService } from '../../../services/message.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-cards',
  standalone: true,
  imports: [RouterModule, HttpClientModule, CommonModule,FormsModule],
  providers: [
    AccountService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  templateUrl: './payment-cards.component.html',
  styles: ``,
})
export class PaymentCardsComponent implements OnInit {
  cardList: EditablePaymentCard[] = [];
  cardNumber = '';
  cardHolderName = '';
  expiryDate = '';
  cvv = '';

  constructor(
    private myProfile: AccountService,
    private storage: StorageService,
    private msgService: MessageService
  ) {}

  ngOnInit(): void {
    this.myProfile.getProfile().subscribe({
      next: (res) => {
        const cards = res?.user?.paymentCards ?? [];
        this.cardList = cards.map((card) => ({ ...card, editable: false }));
        this.storage.setItem('cards', this.cardList);
      },
      error: (err) => {
        console.error('Failed to load cards:', err);
      },
    });
  }

  editCard(card: EditablePaymentCard): void {
    card.editable = true;
  }

  confirmEdit(card: EditablePaymentCard): void {
    card.editable = false;

    // Get updated values from component state
    card.cardNumber = this.cardNumber;
    card.cardHolderName = this.cardHolderName;
    card.expiryDate = this.expiryDate;
    card.cvv = this.cvv;

    this.myProfile.updateProfile({ paymentCards: this.cardList }).subscribe({
      next: (res: any) => {
        const updatedCards = res?.user?.paymentCards ?? [];
        this.cardList = updatedCards.map((card: PaymentCard) => ({ ...card, editable: false }));
        this.storage.setItem('cards', this.cardList);
        this.msgService.show('Card updated successfully');
        this.cardNumber = '';
        this.cardHolderName = '';
        this.expiryDate = '';
        this.cvv = '';
      },
      error: (err) => {
        console.error('Failed to update cards:', err);
      },
    });
  }

  removeCard(card: EditablePaymentCard): void {
    const lastFour = card.cardNumber?.slice(-4) ?? '****';
    this.cardList = this.cardList.filter((c) => c.id !== card.id);
    this.storage.setItem('cards', this.cardList);

    this.myProfile.deletePaymentCard(card.id).subscribe({
      next: (res: any) => {
        this.msgService.show(`Card with last 4 digits ${lastFour} removed successfully`);
        this.myProfile.getProfile().subscribe({
          next: (res) => {
            const cards = res?.user?.paymentCards ?? [];
            this.cardList = cards.map((card) => ({ ...card, editable: false }));
            this.storage.setItem('cards', this.cardList);
          },
          error: (err) => {
            console.error('Failed to refresh cards after removal:', err);
          },
        });
      },
      error: (err) => {
        console.error('Failed to remove card:', err);
      },
    });
  }
}
