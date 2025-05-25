import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/userModel';
import { SearchService } from '../../../services/search.service';
import { ImageService } from '../../../services/image.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { StorageService } from '../../../services/storage.service';
import { MessageService } from '../../../services/message.service';
import gsap from 'gsap';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './navbar.component.html',
  styles: ''
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('navbarWrapper', { static: true }) navbarWrapper!: ElementRef;

  isLoggedIn = false;
  dropdownOpen = false;
  searchTerm = '';
  imageUrl = '';
  lastName = '';
  private destroy$ = new Subject<void>();

  user: User = {
    _id: '',
    profileImageUrl: '',
    firstName: '',
    lastName: '',
    email: '',
    address: {
      city: '',
      street: '',
      buildingNumber: '',
      apartmentNumber: ''
    },
    phone: '',
    gender: 'male',
    isAdmin: true,
    createdAt: '',
    updatedAt: '',
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private searchService: SearchService,
    private imageService: ImageService,
    private LocalStorage: StorageService,
    private msgService: MessageService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.isLoggedIn = status;
        if (status) {
          const userData = this.authService.getUserData();
          if (userData) {
            this.user = userData;
          }
        }
      });

    this.imageService.imageUrl$
      .pipe(takeUntil(this.destroy$))
      .subscribe((url) => {
        this.imageUrl = url || this.user.profileImageUrl;
      });

    this.imageService.name$
      .pipe(takeUntil(this.destroy$))
      .subscribe((name) => {
        this.lastName = name || this.user.lastName;
      });
  }

  ngAfterViewInit(): void {
    gsap.from(this.navbarWrapper.nativeElement, {
      y: -100,
      opacity: 0.3,
      duration: 1,
      ease: 'power3.out'
    });
  }

  onSearchChange(query: string): void {
    this.searchTerm = query;
    this.searchService.setSearchTerm(query);
    if (query.trim() === '') {
      this.router.navigate(['/search']);
    }
  }

  GoToPage(): void {
    if (this.router.url !== '/search') {
      this.router.navigate(['/search']);
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  sign(): void {
    this.router.navigate(['/auth/login']);
  }

  goToCart(): void {
    if (!this.LocalStorage.getItem('token')) {
      this.msgService.show('You must be logged in to go to Cart.');
      this.router.navigate(['/auth/login']);
      return;
    }
    this.router.navigate(['/cart']);
  }

  goToCompare(): void {
    if (!this.LocalStorage.getItem('token')) {
      this.msgService.show('You must be logged in to go to Compare Page.');
      this.router.navigate(['/auth/login']);
      return;
    }
    this.router.navigate(['/compare']);
  }

  viewProfile(): void {
    this.toggleDropdown();
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.toggleDropdown();
    this.authService.logout();
    this.router.navigate(['/auth/login']);
    this.LocalStorage.clear();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
