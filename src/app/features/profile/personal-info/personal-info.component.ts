import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { AuthInterceptor } from '../../../services/auth.interceptor';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-personal-info',
   providers: [AccountService,{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },],
  imports: [RouterModule, HttpClientModule],
  templateUrl: './personal-info.component.html',
  styles: ``
})
export class PersonalInfoComponent implements OnInit {
  data: any;

  constructor(
    private myProfile: AccountService,
    private storage: StorageService
  ) {}

  ngOnInit() {
    this.myProfile.getProfile().subscribe({
      next: (res) => {
        console.log(res);
        this.storage.setItem('user', res.user);
        this.data = res.user;
      },
      error: (err) => {
        console.log(err);
      }
    });
    // Optionally, load from storage if needed:
    this.data = this.storage.getItem('user');
  }
}
