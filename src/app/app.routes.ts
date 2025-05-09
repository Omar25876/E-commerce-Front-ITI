import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './Shared/Components/navbar/auth/login/login.component';
import { RegisterComponent } from './Shared/Components/navbar/auth/register/register.component';
import { AuthComponent } from './Shared/Components/navbar/auth/auth.component';
import { LoginFormComponent } from './Shared/Components/navbar/auth/login/login-form/login-form.component';
import { ForgotPasswordComponent } from './Shared/Components/navbar/auth/login/forgot-password/forgot-password.component';
import { ErrorComponent } from './Shared/Components/error/error.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { SearchComponent } from './Shared/Components/search/search.component';
import { ProductComponent } from './features/product/product.component';
import { ProdDescribComponent } from './features/product/product-sec3/prod-describ/prod-describ.component';
import { ProdFaqComponent } from './features/product/product-sec3/prod-faq/prod-faq.component';
import { ProdReviewsComponent } from './features/product/product-sec3/prod-reviews/prod-reviews.component';

export const routes: Routes = [
  // Redirect to home by default
  { path: '', redirectTo: 'home', pathMatch: 'full' },

   // Home Route
  { path: 'home', component: HomeComponent, title: 'Home'},

  //Categories Route
  { path:'categories', component:CategoriesComponent,title:'Categories' },
  
  //search
  {path:'search',component:SearchComponent,title:'Search'},

  // Product Route
  { path: 'product/:id', component: ProductComponent, title: 'Product' ,children:[
    { path: '', redirectTo: 'description', pathMatch: 'full' },
    { path: 'reviews', component: ProdReviewsComponent, title: 'Reviews' },
    { path: 'description', component: ProdDescribComponent, title: 'Description' },
    { path: 'faq', component: ProdFaqComponent, title: 'FAQ' },
  ]},

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
