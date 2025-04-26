import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './Shared/Components/navbar/auth/login/login.component';
import { RegisterComponent } from './Shared/Components/navbar/auth/register/register.component';
import { AuthComponent } from './Shared/Components/navbar/auth/auth.component';
import { LoginFormComponent } from './Shared/Components/navbar/auth/login/login-form/login-form.component';
import { ForgotPasswordComponent } from './Shared/Components/navbar/auth/login/forgot-password/forgot-password.component';
import { ErrorComponent } from './Shared/Components/error/error.component';

export const routes: Routes = [
  // Redirect to home by default
  { path: '', redirectTo: 'home', pathMatch: 'full' },

   // Home Route
  { path: 'home', component: HomeComponent, title: 'Home'},

   // Auth Routes
  {
    path: 'auth',
    component: AuthComponent,
    title: 'Authentication',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default to login
      { path: 'login', component: LoginComponent, title: 'Login',children:[
        { path: '', component: LoginFormComponent, title: '' },
        { path: 'forgetPassword', component: ForgotPasswordComponent, title: 'Forget Password' },
      ]},
      { path: 'register', component: RegisterComponent, title: 'Register' },
    ],
  },

  // Wildcard Route (404 Page)
  { path: '**', component: ErrorComponent, title: '404 Not Found'},
];
