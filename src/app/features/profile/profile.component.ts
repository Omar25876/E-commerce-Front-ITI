import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../../services/auth.interceptor';

@Component({
  selector: 'app-profile',
  providers: [AccountService,{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },],
  imports: [RouterModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styles: ``
})


export class ProfileComponent  {

}
