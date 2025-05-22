import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import gsap from 'gsap';
import { StorageService } from '../../services/storage.service';
import { SharingUserService } from '../../services/SharingUser.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit, AfterViewInit {
  @ViewChild('headerLogo', { static: true }) headerLogo!: ElementRef;
  @ViewChildren('sidebarBtn') sidebarBtns!: QueryList<ElementRef>;
  @ViewChild('mainContent', { static: true }) mainContent!: ElementRef;

  selectedIndex = 0;
  buttons = [
    {
      label: 'Dashboard',
      defaultSrc: 'Images/Icons/HomeIcon-Black.png',
      activeSrc: 'Images/Icons/HomeIcon-White.png',
      paddingX: 'px-[20%]',
    },
    {
      label: 'Products',
      defaultSrc: 'Images/Icons/Fast Delivery-Black.png',
      activeSrc: 'Images/Icons/Fast Delivery-White.png',
      paddingX: 'px-[8%]',
    },
    {
      label: 'Orders',
      defaultSrc: 'Images/Icons/Orders-Black.png',
      activeSrc: 'Images/Icons/Orders-White.png',
      paddingX: 'px-[20%]',
    },
    {
      label: 'Add',
      defaultSrc: 'Images/Icons/Add-Black.png',
      activeSrc: 'Images/Icons/Add-White.png',
      paddingX: 'px-[20%]',
    },
    
  ];
  DimmerOn:boolean=false;
  Userorder:any;
  Admin:any;

  constructor(
    private AuthSer: AuthService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private SharingUs:SharingUserService
  ) {}

  ngOnInit(): void {
    const temp = this.router.url.split('/')[2];
    const index = this.buttons.findIndex((button) => button.label === temp);
    this.selectedIndex = index !== -1 ? index : 0;
    
    this.SharingUs.isPressed$.subscribe((pressed) => {
      if (pressed) {
        const order = this.SharingUs.getUser();
        this.Userorder={...order};
        console.log('Received user:', order);
        this.DimmerOn=true;
      }
    });
    this.Admin=this.AuthSer.getUserData();
  }

  ngAfterViewInit(): void {
    // Animate logo
    gsap.from(this.headerLogo.nativeElement, {
      opacity: 0.3,
      y: -50,
      duration: 0.8,
      delay: 0.2,
      ease: 'power2.out',
    });

    // Animate sidebar buttons
    gsap.from(this.sidebarBtns.map(el => el.nativeElement), {
      opacity: 0.3,
      x: -30,
      duration: 0.6,
      stagger: 0.15,
      delay: 0.5,
      ease: 'power2.out',
    });

    // Animate main content
    gsap.from(this.mainContent.nativeElement, {
      opacity: 0.3,
      y: 20,
      duration: 0.7,
      delay: 0.8,
      ease: 'power2.out',
    });
  }

  selectButton(index: number) {
    this.selectedIndex = index;
  }

  Logout() {
    this.AuthSer.logout();
    this.cdRef.detectChanges();
  }
}
