import { AccountService } from '../../../services/account.service';
import { StorageService } from '../../../services/storage.service';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AuthInterceptor } from '../../../services/auth.interceptor';
import { EditablePaymentCard, PaymentCard } from '../../../models/profileModel';
import { MessageService } from '../../../services/message.service';
import { FormsModule } from '@angular/forms';
import { Component, OnInit, AfterViewInit, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
// ... (existing imports)

@Component({
  selector: 'app-payment-cards',
  standalone: true,
  imports: [RouterModule, HttpClientModule, CommonModule, FormsModule],
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
export class PaymentCardsComponent implements OnInit, AfterViewInit {
  cardList: EditablePaymentCard[] = [];
  cardNumber = '';
  cardHolderName = '';
  expiryDate = '';
  cvv = '';

  @ViewChildren('cardRef') cardElements!: QueryList<ElementRef>;

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
        setTimeout(() => this.animateCards(), 100); // Animate after DOM update
      },
      error: (err) => console.error('Failed to load cards:', err),
    });
  }

  ngAfterViewInit(): void {
    // This ensures animations on static card content (if needed)
    this.animateCards();
  }

  animateCards(): void {
    gsap.from(this.cardElements.map((el) => el.nativeElement), {
      duration: 0.8,
      opacity: 0.2,
      y: 50,
      stagger: 0.15,
      ease: 'power2.out',
    });
  }

  // editCard, confirmEdit, removeCard remain unchanged
  editCard(card: EditablePaymentCard): void {
    card.editable = true;
  }

  confirmEdit(card: EditablePaymentCard): void {
    card.editable = false;
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
        setTimeout(() => this.animateCards(), 100);
      },
      error: (err) => console.error('Failed to update cards:', err),
    });
  }

  removeCard(card: EditablePaymentCard): void {
    const lastFour = card.cardNumber?.slice(-4) ?? '****';
    const cardEl = this.cardElements.find((el) =>
      el.nativeElement.innerText.includes(lastFour)
    );

    if (cardEl) {
      gsap.to(cardEl.nativeElement, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        onComplete: () => this.finalizeCardRemoval(card, lastFour),
      });
    } else {
      this.finalizeCardRemoval(card, lastFour);
    }
  }

  private finalizeCardRemoval(card: EditablePaymentCard, lastFour: string): void {
    this.cardList = this.cardList.filter((c) => c.id !== card.id);
    this.storage.setItem('cards', this.cardList);

    this.myProfile.deletePaymentCard(card.id).subscribe({
      next: () => {
        this.msgService.show(`Card with last 4 digits ${lastFour} removed successfully`);
        this.myProfile.getProfile().subscribe({
          next: (res) => {
            const cards = res?.user?.paymentCards ?? [];
            this.cardList = cards.map((card) => ({ ...card, editable: false }));
            this.storage.setItem('cards', this.cardList);
            setTimeout(() => this.animateCards(), 100);
          },
          error: (err) => console.error('Failed to refresh cards after removal:', err),
        });
      },
      error: (err) => console.error('Failed to remove card:', err),
    });
  }
}
