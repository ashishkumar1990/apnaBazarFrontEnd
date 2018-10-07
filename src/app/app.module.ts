import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { AppMaterialDesignModule } from './app.material';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CategoryComponent } from './shared/category/category.component';


import { ToastrModule } from 'ngx-toastr';

import { HomeModule } from './home/home.module';
import { ProductsModule } from './products/products.module';
import { ProductDetailModule } from './products/productDetail/product_detail.module';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { MyDialogBoxComponent } from './products/products.component';



@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        SignupComponent,
        LandingComponent,
        ProfileComponent,
        FooterComponent,
        CategoryComponent,
        MyDialogBoxComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        NgbModule.forRoot(),
        FormsModule,
        RouterModule,
        AppRoutingModule,
        HomeModule,
        ProductsModule,
        ProductDetailModule,
        AppMaterialDesignModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
        })
    ],
    entryComponents:[MyDialogBoxComponent],
    providers: [CookieService],
    bootstrap: [AppComponent]
})
export class AppModule { }
