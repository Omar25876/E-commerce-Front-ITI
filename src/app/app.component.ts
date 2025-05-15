import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { NavbarComponent } from './Shared/Components/navbar/navbar.component';
import { FooterComponent } from './Shared/Components/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { MessageComponent } from './Shared/Components/message/message.component';
import { MessageService } from './services/message.service';
import { AuthService } from './services/auth.service';
import { AccountService } from './services/account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterOutlet, MessageComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // ✅ use 'styleUrls'
})
export class AppComponent {
  title = 'frontend';
  User:any;
  constructor(
    public AuthSer:AuthService,
    private Profile:AccountService
  ){};

  ngOnInit(): void {
     this.Profile.getProfile().subscribe({
        next: (res) => {
          this.User=res.user;
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

}

