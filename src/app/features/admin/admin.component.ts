import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.component.html'
})
export class AdminComponent {

  constructor(private AuthSer:AuthService,private cdRef:ChangeDetectorRef){};
  Logout(){
    this.AuthSer.logout();
    this.cdRef.detectChanges();
  };
}
