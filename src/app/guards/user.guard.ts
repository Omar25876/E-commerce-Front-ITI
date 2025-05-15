import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const userGuard: CanActivateFn = (route, state) => {
  const AuthSer = inject(AuthService);
  const router = inject(Router);
  if(AuthSer?.getUserData()?.isAdmin === true)
    {
      router.navigate(['/admin']);
      return false;
    } 
    return true;  
};
