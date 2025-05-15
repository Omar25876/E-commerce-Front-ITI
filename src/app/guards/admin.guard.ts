import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const AuthSer = inject(AuthService);
  const router = inject(Router);
  
  if(AuthSer.isLoggedIn() && AuthSer.getUserData().isAdmin)
    return true;
  else 
  {
    router.navigate(['/home']);
    return false;
  }
};
