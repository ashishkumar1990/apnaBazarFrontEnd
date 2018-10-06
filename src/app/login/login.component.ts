import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import {Login} from './login';
import {ToastrService} from 'ngx-toastr';
import {FormsModule, NgForm}  from '@angular/forms';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import {LoginService} from './login.service';




//declare const FB:any;
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    login: Login = {
        "email": "",
        "password": ""
    };
    loading:string="";
    loginForm: NgForm;
    @ViewChild('loginForm') currentForm: NgForm;

    constructor(private _router:Router,private _cookie:CookieService,private _login:LoginService, private toastr: ToastrService,) {
        //FB.init({
        //    appId      : '197240367495969',
        //    cookie     : false,  // enable cookies to allow the server to access
        //    // the session
        //    xfbml      : true,  // parse social plugins on this page
        //    version    : 'v2.5' // use graph api version 2.5
        //});
    }

    //
    //statusChangeCallback(response: any) {
    //    if (response.status === 'connected') {
    //        console.log('connected');
    //    }
    //}

    onFacebookLoginClick() {
        //FB.logout();
        //FB.login(function(result) {
        //    this.loged = true;
        //    this.token = result;
        //    FB.api('/me?fields=id,name,first_name,gender,picture.width(150).height(150),age_range,friends',
        //        function(result) {
        //            if (result && !result.error) {
        //                this.user = result;
        //                console.log(this.user);
        //            } else {
        //                console.log(result.error);
        //            }
        //        });
        //});
    }

    ngOnInit() {
        this._cookie.put('customerToken', "");
        this._cookie.put('customerDetail', "");
        this._cookie.put('customerCartDetail', "");
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
                this.toastr.success("Login customer Successfully");
                this.loading="Loading Customer";
                this._login.getCustomerDetail(tokenData)
                    .subscribe(
                        customer => {
                            this._cookie.put('customerDetail', JSON.stringify(customer));

                            this.toastr.success("customer loaded Successfully");
                            this.loading="Loading customer cart";
                            this._login.getCustomerCartDetail(tokenData)
                                .subscribe(
                                    cart => {
                                        this._cookie.put('customerCartDetail', JSON.stringify(cart));
                                        this.toastr.success("customer cart loaded Successfully");
                                        this._router.navigate(['/category']);
                                    },
                                    error => {
                                        this._router.navigate(['login']);
                                        this.toastr.error(error.message);
                                    }
                                );
                        },
                        error => {
                            this._router.navigate(['login']);
                            this.toastr.error(error.message);
                        }
                    );
            },
            error => {
                this._router.navigate(['login']);
                this.toastr.error(error.message);
            }
        );
    }

    loadHomePage() {
        this._router.navigate(['/category']);
    }
}
