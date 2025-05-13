import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Product, Review } from '../../../../models/productModel';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../services/product.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthInterceptor } from '../../../../services/auth.interceptor';

@Component({
  selector: 'app-prod-reviews',
  templateUrl: './prod-reviews.component.html',
  styles: '',
  providers: [ProductService,{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },],
  imports: [CommonModule, FormsModule, HttpClientModule],
})
export class ProdReviewsComponent implements OnInit {
  product: Product = {
    _id: '',
    name: '',
    description: '',
    price: 0,
    oldPrice: 0,
    discount: 0,
    colors: [],
    images: [],
    imagesAndColors: {},
    selectedColor: '',
    stock: 0,
    rating: 0,
    reviewsCount: 0,
    reviews: [],
    highlights: [],
    specs: {},
    modelNumber: '',
    modelName: '',
    whatsInTheBox: [],
    isPopular: false,
    isNewArrival: false,
    isDiscover: false,
    category: '',
    brand: '',
    createdAt: '',
    updatedAt: '',
  };

  selectedFilter: string = 'all'; // Default filter

  constructor(private productService: ProductService, private router: Router) {}

  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  ratingCounts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; // Object to store counts for each rating
  newReview: { comment: string; rating: number } = {
    comment: '',
    rating: 0,
  };
  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedProduct = localStorage.getItem('product');
      if (storedProduct) {
        this.product = JSON.parse(storedProduct);
        this.reviews = this.product.reviews;
        this.filteredReviews = [...this.reviews]; // Initialize filtered reviews
        this.calculateRatingCounts(); // Calculate the counts for each rating
      }
    }
  }

  /**
   * Calculate the number of reviews for each rating (1-5)
   */
  private calculateRatingCounts(): void {
    this.ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; // Reset counts
    this.reviews.forEach((review) => {
      const roundedRating = Math.floor(review.rating); // Round down to the nearest whole number
      if (roundedRating >= 1 && roundedRating <= 5) {
        this.ratingCounts[roundedRating]++;
      }
    });
  }

  /**
   * Filter reviews based on language
   * @param language - 'all', 'arabic', or 'non-arabic'
   */
  filterReviews(language: string): void {
    this.selectedFilter = language; // Update the selected filter
    if (language === 'all') {
      this.filteredReviews = [...this.reviews];
    } else if (language === 'arabic') {
      this.filteredReviews = this.reviews.filter((review) =>
        this.containsArabic(review.comment)
      );
    } else if (language === 'non-arabic') {
      this.filteredReviews = this.reviews.filter(
        (review) => !this.containsArabic(review.comment)
      );
    }
  }

  private containsArabic(text: string): boolean {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicRegex.test(text);
  }

  /**
   * Track reviews by their unique ID
   * @param index - Index of the review
   * @param review - The review object
   * @returns The unique ID of the review
   */
  trackByReview(index: number, review: Review): string {
    return review._id;
  }

  addReview(): void {
    if (this.newReview.comment && this.newReview.rating) {

      this.productService.addReviewToProduct(this.product._id, this.newReview).subscribe({
        next: (res) => {
          console.log('Product updated successfully:', res);
          this.router.navigate(['/product/'+this.product._id+"/reviews"]);
          this.reviews = res.product.reviews;
          this.filteredReviews = [...this.reviews];
          this.calculateRatingCounts();
          this.newReview = { comment: '', rating: 0 };
        },
        error: (err) => {
          console.error('Error updating product:', err);
        },
      });
    } else {
      console.error('Review comment or rating is missing.');
    }
  }
}


