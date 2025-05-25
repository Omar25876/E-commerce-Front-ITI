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
import { CartComponent } from './features/cart/cart.component';
import { ProductComponent } from './features/product/product.component';
import { ProdDescribComponent } from './features/product/product-sec3/prod-describ/prod-describ.component';
import { ProdFaqComponent } from './features/product/product-sec3/prod-faq/prod-faq.component';
import { ProdReviewsComponent } from './features/product/product-sec3/prod-reviews/prod-reviews.component';
import { ProfileComponent } from './features/profile/profile.component';
import { PersonalInfoComponent } from './features/profile/personal-info/personal-info.component';
import { PaymentCardsComponent } from './features/profile/payment-cards/payment-cards.component';
import { MyOrdersComponent } from './features/profile/my-orders/my-orders.component';
import { authGuard } from './guards/auth.guard';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { AdminComponent } from './features/admin/admin.component';
import { AdminDashComponent } from './features/admin/admin-dash/admin-dash.component';
import { AdminProdsComponent } from './features/admin/admin-prods/admin-prods.component';
import { AdminOrdersComponent } from './features/admin/admin-orders/admin-orders.component';
import { AdminAddComponent } from './features/admin/admin-add/admin-add.component';
import { adminGuard } from './guards/admin.guard';
import { userGuard } from './guards/user.guard';
import { CompareComponent } from './features/compare/compare.component';

export const routes: Routes = [
  // Redirect to home by default
  { path: '', redirectTo: 'home', pathMatch: 'full'},

  // Home Route
  { path: 'home', component: HomeComponent, title: 'Home' , canActivate:[userGuard]},

  //Categories Route
  { path: 'categories', component: CategoriesComponent, title: 'Categories', canActivate:[userGuard] },

  //search
  { path: 'search', canActivate:[userGuard], loadComponent:()=>import('./Shared/Components/search/search.component').then(c=>c.SearchComponent), title: 'Search' },

  // Cart Route
  {path: 'cart',component: CartComponent,canActivate: [authGuard],title: 'Cart'},

  //Checkout Route
  {path: 'checkout',component: CheckoutComponent,canActivate: [authGuard],title: 'Checkout'},

  {path:'compare',loadComponent:()=>import('./features/compare/compare.component').then(c=>CompareComponent),title:'Compare',canActivate: [authGuard]},

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard],
    title: 'Admin Home',
    children:[
      {path:'',redirectTo:'Dashboard',pathMatch:'full'},
      {path:'Dashboard',component:AdminDashComponent,title:'Dashboard'},
      {path:'Products',component:AdminProdsComponent,title:'Mange Products'},
      {path:'Orders',component:AdminOrdersComponent,title:'Mange Orders'},
      {path:'Add',component:AdminAddComponent,title:'Add Products'}
    ]
  },

  //Hello
  // Product Route
  {
    path: 'product/:id',
    component: ProductComponent,
    title: 'Product',
    canActivate:[userGuard],

    children: [
      { path: '', redirectTo: 'description', pathMatch: 'full' },
      { path: 'reviews', component: ProdReviewsComponent, title: 'Reviews' },
      {
        path: 'description',
        component: ProdDescribComponent,
        title: 'Description',
      },
      { path: 'faq', component: ProdFaqComponent, title: 'FAQ' },
    ],
  },

  // Auth Routes
  {
    path: 'auth',
    component: AuthComponent,
    title: 'Authentication',
    canActivate:[userGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default to login
      {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
        children: [
          { path: '', component: LoginFormComponent, title: '' },
          {
            path: 'forgetPassword',
            component: ForgotPasswordComponent,
            title: 'Forget Password',
          },
        ],
      },
      { path: 'register', component: RegisterComponent, title: 'Register' },
    ],
  },

  // profile route
  {path: 'dashboard', component: ProfileComponent, title: 'Profile', canActivate:[authGuard], children: [
    {path: '', redirectTo: 'personal-info', pathMatch: 'full'},
    {path: 'personal-info', component: PersonalInfoComponent, title: 'Personal Info'},
    {path: 'payment-cards', component: PaymentCardsComponent, title: 'Payment Cards'},
    {path: 'orders', component: MyOrdersComponent, title: 'Orders'},
  ]},

  // Wildcard Route (404 Page)
  { path: '**', component: ErrorComponent, title: '404 Not Found' },
];
