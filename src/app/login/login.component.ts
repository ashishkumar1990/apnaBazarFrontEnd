import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import {Login} from './login';
import {ToastrService} from 'ngx-toastr';
import {MessageService} from 'primeng/api';
import {NgForm}  from '@angular/forms';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import {LoginService} from './login.service';
import { CartService } from '../shared/cart/cart.service';




//declare const FB:any;
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers:[MessageService]
})
export class LoginComponent implements OnInit {
    login: Login = {
        "email": "",
        "password": ""
    };
    loading:string="";
    loginForm: NgForm;
    @ViewChild('loginForm') currentForm: NgForm;

    constructor(private _router:Router,private _cookie:CookieService,private _login:LoginService, private toastr: ToastrService,private _cartService:CartService,private messageService: MessageService) {

    }
    ngOnInit() {
        this._cookie.put('customerToken', "");
        this._cookie.put('customerDetail', "");
        this._cookie.put('customerCartCount', "");
    }

    customerLogin() {
        if (this.currentForm.control.controls.email.invalid || this.currentForm.control.controls.password.invalid) {
            return;
        }
        this.loading="Validate Credentials";
        let user = {
            username: this.login.email,
            password: this.login.password
        };
        this._login.getCustomerToken(user)
            .subscribe(
            token => {
                this._cookie.put('customerToken', "Bearer " + token);
                let tokenData=this._cookie.get('customerToken');
                this.messageService.add({severity:'success', summary:'Login', detail:'Login customer Successfully'});

                // this.toastr.success("Login customer Successfully");
                this.loading="Loading Customer";
                this._login.getCustomerDetail(tokenData)
                    .subscribe(
                        customer => {
                            this._cookie.put('customerDetail', JSON.stringify(customer));
                            this.messageService.add({severity:'success', summary:'Customer', detail:'Customer details loaded Successfully'});

                            // this.toastr.success("customer loaded Successfully");
                            this.loading="Loading customer cart";
                            this._cartService.getCustomerCartDetail()
                                .subscribe(
                                    cart => {
                                        let cartData = {
                                            itemsCount: cart.items_count
                                        };
                                        this._cookie.put('customerCartCount', JSON.stringify(cartData));
                                        this._cartService.setCartItemCount(cartData.itemsCount);
                                        this.messageService.add({severity:'success', summary:'Cart', detail:'Customer cart loaded Successfully'});

                                        // this.toastr.success("customer cart loaded Successfully");
                                        this._router.navigate(['/category']);
                                    },
                                    error => {
                                        this.loading="";
                                        this._router.navigate(['login']);
                                        this.toastr.error(error.message);
                                    }
                                );
                        },
                        error => {
                            this.loading="";
                            this._router.navigate(['login']);
                            this.toastr.error(error.message);
                        }
                    );
            },
            error => {
                this.loading="";
                this._router.navigate(['login']);
                this.toastr.error(error.message);
            }
        );
    }

    loadHomePage() {
        this._router.navigate(['/category']);
    }
}
