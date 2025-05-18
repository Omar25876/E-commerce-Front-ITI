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
import { MessageService } from '../../../services/message.service';
import gsap from 'gsap';
import { ElementRef, ViewChild, AfterViewInit } from '@angular/core';


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
export class PersonalInfoComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mainContainer', { static: false }) mainContainer!: ElementRef;
  @ViewChild('profileCard', { static: false }) profileCard!: ElementRef;
  @ViewChild('addressCard', { static: false }) addressCard!: ElementRef;
  @ViewChild('phoneCard', { static: false }) phoneCard!: ElementRef;
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
    private router: Router,
    private MesSer:MessageService
  ) {}

  ngOnInit(): void {
    this.fetchProfile();

    this.imageService.imageUrl$
      .pipe(takeUntil(this.destroy$))
      .subscribe((url) => {
        this.imageUrl = url;
      });
  }
  ngAfterViewInit(): void {
    this.animateCards();
  }

  animateCards(): void {
    gsap.from(this.mainContainer.nativeElement, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power2.out',
    });

    gsap.from(this.profileCard.nativeElement, {
      opacity: 0,
      x: -50,
      delay: 0.3,
      duration: 0.8,
      ease: 'back.out(1.7)',
    });

    gsap.from(this.addressCard.nativeElement, {
      opacity: 0,
      x: 50,
      delay: 0.5,
      duration: 0.8,
      ease: 'back.out(1.7)',
    });

    gsap.from(this.phoneCard.nativeElement, {
      opacity: 0,
      x: 50,
      delay: 0.7,
      duration: 0.8,
      ease: 'back.out(1.7)',
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
      this.MesSer.show("Please Upload Image From Your PC First")
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
        this.MesSer.show("Profile Image Updated Successfully");
        this.loading = false;
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Upload failed:', err);
        this.MesSer.show("Profile Image Updated Failed");
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
        this.MesSer.show("Personal Info Updated Successfully");
      },
      error: (err) => {
        console.error('Failed to update info:', err);
        this.uniqueEmail = true;
        this.MesSer.show("Personal Info Updated Failed");
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
        this.MesSer.show("Personal Address Updated Successfully");
      },
      error: (err) => {
        console.error('Failed to update address:', err);
        this.MesSer.show("Personal Address Updated Failed");
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
        this.MesSer.show("Phone Number Updated Successfully");
        this.uniquePhone = false;
      },
      error: (err) => {
        console.error('Failed to update phone:', err);
        this.uniquePhone = true;
        this.MesSer.show("Phone Number Updated Failed");
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
