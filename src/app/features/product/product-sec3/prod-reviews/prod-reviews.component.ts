import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-prod-reviews',
  templateUrl: './prod-reviews.component.html',
  styles: '',
  imports: [CommonModule],
})
export class ProdReviewsComponent {
  reviews = [
    {
      username: 'Alice',
      initial: 'A',
      verified: true,
      rating: 5,
      date: '22 Jan, 2023',
      comment: 'This is a great product!',
      language: 'english',
    },
    {
      username: 'Ahmed',
      initial: 'A',
      verified: false,
      rating: 4,
      date: '20 Jan, 2023',
      comment: 'منتج رائع!',
      language: 'arabic',
    },
    {
      username: 'John',
      initial: 'J',
      verified: true,
      rating: 3,
      date: '18 Jan, 2023',
      comment: 'Good, but could be better.',
      language: 'english',
    },
  ];

  filteredReviews = [...this.reviews];

  filterReviews(language: string): void {
    if (language === 'all') {
      this.filteredReviews = [...this.reviews];
    } else {
      this.filteredReviews = this.reviews.filter(
        (review) => review.language === language
      );
    }
  }
}
