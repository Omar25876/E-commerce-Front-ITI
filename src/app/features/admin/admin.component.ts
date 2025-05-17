import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [CommonModule,RouterModule],
  templateUrl: './admin.component.html'
})
export class AdminComponent {
  selectedIndex = 1;

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

  selectButton(index: number) {
    this.selectedIndex = index;
    console.log(this.buttons[this.selectedIndex].label);
  }

  constructor(
    private AuthSer:AuthService,
    private cdRef:ChangeDetectorRef
  ){};

  Logout(){
    this.AuthSer.logout();
    this.cdRef.detectChanges();
  };
}
