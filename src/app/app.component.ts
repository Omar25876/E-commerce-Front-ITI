import { Component } from '@angular/core';

import { NavbarComponent } from './Shared/Components/navbar/navbar.component';
import { FooterComponent } from './Shared/Components/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, FooterComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
}
