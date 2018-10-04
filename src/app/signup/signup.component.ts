import {Component, OnInit, ViewChild} from '@angular/core';
import {SignupService} from './signup.service';
import {ToastrService} from 'ngx-toastr';
import {Signup} from './signup';
import {FormsModule, NgForm}  from '@angular/forms';
import {AppRoutingModule} from '../app.routing';
import {Router} from '@angular/router';
import { CookieService } from 'angular2-cookie/services/cookies.service';


@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    providers: [SignupService]
})
export class SignupComponent implements OnInit {
    signup: Signup = {
        "email": "",
        "emailExists": false,
        "emailAvailable": "",
        "firstname": "",
        "lastname": "",
        "storeId": 1,
        "websiteId": 1,
        "password": "",
        "conformPassword": ""
    };
    createCustomer="";
    signupForm: NgForm;
    @ViewChild('signupForm') currentForm: NgForm;

    constructor(private _cookie:CookieService,private _signupService: SignupService, private toastr: ToastrService, private _router: Router) {
    }

    ngOnInit() {
        this._cookie.put('customerToken', "");
        this._cookie.put('customerDetail', "");
        this._cookie.put('customerCartDetail', "");
    }

    checkEmailAvailable() {
        if (this.currentForm.control.controls.email.invalid || this.signup.emailAvailable === this.signup.email) {
            return;
        }
        if (this.signup.email) {
            let emailData = {"customerEmail": this.signup.email};

            this._signupService.checkEmailAvailable(emailData)
                .subscribe(
                    emailExists => {
                        this.signup.emailExists = emailExists;
                        if (!this.signup.emailExists) {
                            this.currentForm.form.controls['email'].setErrors({'incorrect': true});
                            this.toastr.error("Email already exists,please add new One");
                        } else {
                            this.toastr.success("Email Added Successfully");
                            //working//this._router.navigateByUrl('/home');
                        }

                    },
                    error => {
                        this.toastr.error(error.message);
                    }
                );

        }

    }

    createCustomerAccount() {
        if (this.signup.email && this.signup.emailExists) {
            this.createCustomer="Creating customer";
            let customerData = {
                "customer": {
                    "email": this.signup.email,
                    "firstname": this.signup.firstname,
                    "lastname": this.signup.lastname,
                    "storeId": 1,
                    "websiteId": 1
                },
                "password": this.signup.password,
            };

            this._signupService.createCustomer(customerData)
                .subscribe(
                    customer => {
                        this._cookie.put('customerDetail',JSON.stringify(customer));
                        let user = {
                            username: customer.email,
                            password: this.signup.password
                        };
                        this._signupService.getCustomerToken(user)
                            .subscribe(
                                token => {
                                    this._cookie.put('customerToken', "Bearer " + token);
                                    let tokenData=this._cookie.get('customerToken');
                                    this.createCustomer="Creating customer cart";
                                    this.toastr.success("Create customer Successfully");
                                    this._signupService.customerCartCreate(tokenData)
                                        .subscribe(
                                            cart => {
                                                console.log(cart);
                                                this.toastr.success("customer cart created Successfully");

                                                this._router.navigate(['home']);
                                            },
                                            error => {
                                                this.toastr.error(error.message);
                                            }
                                        );
                                },
                                error => {
                                    this.toastr.error(error.message);
                                }
                            );
                    },
                    error => {
                        this.toastr.error(error.message);
                    }
                );

        }


    }


}


