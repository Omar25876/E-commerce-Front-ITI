import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [CommonModule,RouterModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  selectedIndex = 2;

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
  constructor(
    private AuthSer:AuthService,
    private cdRef:ChangeDetectorRef,
    private router:Router
  ){};
  ngOnInit(): void {
    let temp = this.router.url.split('/')[2];
    this.selectedIndex= this.buttons.findIndex(button => button.label === temp);
  }
  
  selectButton(index: number) {
    this.selectedIndex = index;
  }

  
  Logout(){
    this.AuthSer.logout();
    this.cdRef.detectChanges();
  };
}
