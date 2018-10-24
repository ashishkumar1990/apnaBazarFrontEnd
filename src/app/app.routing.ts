import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent} from './shared/category/category.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './products/productDetail/product_detail.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { PaymentOptionComponent } from './payment-option/payment-option.component';
import { PaymentStatusComponent } from './payment-status/payment-status.component';

const routes: Routes =[
    { path: 'login',             component: LoginComponent },
    { path: 'category',             component: CategoryComponent },
    { path: 'home',             component: HomeComponent },
    { path: 'user-profile/:selectedTab', component: ProfileComponent },
    { path: 'signup',           component: SignupComponent },
    { path: 'category-id/:categoryId/products',component: ProductsComponent },
    { path: 'category-id/:currentCategoryId/product-sku/:product.sku',component: ProductDetailComponent },
    { path: 'payment-option/:methodType/method',          component: PaymentOptionComponent },
    { path: 'payment/status/success',      component: PaymentStatusComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
