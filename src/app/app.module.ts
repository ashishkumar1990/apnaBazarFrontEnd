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
import { FooterComponent } from './shared/footer/footer.component';
import { CategoryComponent } from './shared/category/category.component';


import { ToastrModule } from 'ngx-toastr';

import { HomeModule } from './home/home.module';
import { ProductsModule } from './products/products.module';
import { ProductDetailModule } from './products/productDetail/product_detail.module';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { MyDialogBoxComponent } from './products/products.component';
import { CartValidationComponent } from './products/productDetail/product_detail.component';
import { PaymentOptionComponent} from './payment-option/payment-option.component';
import { CheckScriptsPipe, SafeHtmlPipe } from './payment-option/helper';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ToastModule} from 'primeng/toast';
import {MessagesModule} from 'primeng/messages';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        SignupComponent,
        LandingComponent,
        ProfileComponent,
        FooterComponent,
        CategoryComponent,
        MyDialogBoxComponent,
        CartValidationComponent,
        PaymentOptionComponent,
        SafeHtmlPipe,
        CheckScriptsPipe,
        PaymentStatusComponent
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
        ConfirmDialogModule,
        ToastModule,
        MessagesModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({
            timeOut: 5000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
        })
    ],
    entryComponents:[MyDialogBoxComponent,CartValidationComponent],
    providers: [CookieService],
    bootstrap: [AppComponent]
})
export class AppModule { }
