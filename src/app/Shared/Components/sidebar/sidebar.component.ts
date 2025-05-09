import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  Stars:number[]=[1,2,3,4,5]
}
