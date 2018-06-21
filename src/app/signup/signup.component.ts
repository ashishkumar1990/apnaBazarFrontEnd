import { Component, OnInit } from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import { Signup } from './signup';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signup:Signup = {
    "email": "",
    "emailExists":false,
    "emailAvailable":false,
    "firstname": "",
    "lastname": "",
    "storeId": 1,
    "websiteId": 1,
    "password": "",
    "conformPassword": ""
  };

  constructor(private _http: Http) { }

  ngOnInit() {
  }

  checkEmailAvailable(){
    if (this.signup.emailAvailable) {
      return;
    }
    if (this.signup.email) {
      let emailData = {"customerEmail": this.signup.email};
      this._http.post('http://localhost/rest/V1/customers/isEmailAvailable', emailData)
          .subscribe(data => {
            this.signup.emailAvailable = data.json();
            if(!this.signup.emailAvailable ){
              this.signup.emailExists = true;
            }

          });
    }

  }

  createCustomerAccount(){
    if(this.signup.email && this.signup.emailAvailable){
      let customerData = {
        "customer": {
          "email": this.signup.email,
          "firstname":this.signup.firstname,
          "lastname":this.signup.lastname,
          "storeId": 1,
          "websiteId": 1
        },
        "password":this.signup.password,
      };
      this._http.post('http://localhost/rest/V1/customers/', customerData)
          .subscribe(data => {
            console.log(data);
          });
    }



  }


}


