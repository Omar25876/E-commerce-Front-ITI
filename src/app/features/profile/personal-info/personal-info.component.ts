import { Component, OnInit, OnDestroy } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { AccountService } from '../../../services/account.service';
import { AuthInterceptor } from '../../../services/auth.interceptor';
import { StorageService } from '../../../services/storage.service';
import { ImageService } from '../../../services/image.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-personal-info',
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
  templateUrl: './personal-info.component.html',
  styles: ``,
})
export class PersonalInfoComponent implements OnInit, OnDestroy {
  data: any;
  selectedFile: File | null = null;
  loading = false;
  uniqueEmail = false;
  uniquePhone = false;
  imageUrl = '';

  phonePrefix = '';
  phoneNumber = '';

  private destroy$ = new Subject<void>();

  constructor(
    private myProfile: AccountService,
    private storage: StorageService,
    private imageService: ImageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchProfile();

    this.imageService.imageUrl$
      .pipe(takeUntil(this.destroy$))
      .subscribe((url) => {
        this.imageUrl = url;
      });
  }

  fetchProfile(): void {
    this.myProfile.getProfile().subscribe({
      next: (res) => {
        this.data = res.user;
        this.storage.setItem('user', this.data);
        this.imageService.setImageUrl(this.data.profileImageUrl);

        if (this.data.phone) {
          this.phonePrefix = this.data.phone.slice(0, 3);
          this.phoneNumber = this.data.phone.slice(3);
        }

        this.data.address = this.data.address || {
          city: '',
          street: '',
          buildingNumber: '',
          apartmentNumber: '',
        };
      },
      error: (err) => {
        console.error('Failed to load profile:', err);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  upload(): void {
    if (!this.selectedFile) {
      console.warn('No file selected!');
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('profileImage', this.selectedFile);

    this.myProfile.updateProfile(formData).subscribe({
      next: (res: any) => {
        this.data = res.user;
        this.storage.setItem('user', this.data);
        this.imageService.setImageUrl(this.data.profileImageUrl);
        this.loading = false;
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Upload failed:', err);
        this.loading = false;
      },
    });
  }

  updateInfo(): void {
    const updatedInfo = {
      firstName: this.data.firstName,
      lastName: this.data.lastName,
      email: this.data.email,
    };

    this.myProfile.updateProfile(updatedInfo).subscribe({
      next: (res: any) => {
        this.data = res.user;
        this.storage.setItem('user', this.data);
        this.router.navigate(['/dashboard']);
        this.uniqueEmail = false;
      },
      error: (err) => {
        console.error('Failed to update info:', err);
        this.uniqueEmail = true;
      },
    });
  }

  updateAddress(): void {
    const updatedAddress = {
      address: {
        city: this.data.address.city,
        street: this.data.address.street,
        buildingNumber: this.data.address.buildingNumber,
        apartmentNumber: this.data.address.apartmentNumber,
      },
    };

    this.myProfile.updateProfile(updatedAddress).subscribe({
      next: (res: any) => {
        this.data = res.user;
        this.storage.setItem('user', this.data);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Failed to update address:', err);
      },
    });
  }

  updatePhone(): void {
    const fullPhone = this.phonePrefix + this.phoneNumber;

    this.myProfile.updateProfile({ phone: fullPhone }).subscribe({
      next: (res: any) => {
        this.data = res.user;
        this.storage.setItem('user', this.data);
        this.router.navigate(['/dashboard']);
        this.uniquePhone = false;
      },
      error: (err) => {
        console.error('Failed to update phone:', err);
        this.uniquePhone = true;
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
