import { Component, OnInit,ViewChild} from '@angular/core';
import { SignService } from './sign.service';
import { ToastrService } from 'ngx-toastr';
import { Signup } from './signup';
import { FormsModule, NgForm}  from '@angular/forms';
import { AppRoutingModule} from '../app.routing';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers:[SignService]
})
export class SignupComponent implements OnInit {
  signup:Signup = {
    "email": "",
    "emailExists":false,
    "emailAvailable":"",
    "firstname": "",
    "lastname": "",
    "storeId": 1,
    "websiteId": 1,
    "password": "",
    "conformPassword": ""
  };
  signupForm: NgForm;
  @ViewChild('signupForm') currentForm: NgForm;

  constructor(private _signService: SignService,private toastr: ToastrService,private _router: Router) { }

  ngOnInit() {
  }

  checkEmailAvailable(){
    if (this.signup.emailAvailable===this.signup.email) {
      return;
    }
    if (this.signup.email) {
      let emailData = {"customerEmail": this.signup.email};

      this._signService.checkEmailAvailable(emailData)
          .subscribe(
              emailExists => {
                this.signup.emailExists = emailExists;
                if(!this.signup.emailExists){
                  this.currentForm.form.controls['email'].setErrors({'incorrect': true});
                  this.toastr.error("Email already exists,please add new One");
                }else{
                  this.toastr.success("Email Added Successfully");
                  //working//this._router.navigateByUrl('/home');
                }

          },
              error=> {
            this.toastr.error(error.message);
          }
      );

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

      this._signService.createCustomer(customerData)
          .subscribe(
              customer => {
                console.log(customer);
            this.toastr.success("Categories Loaded Successfully");
            //this._router.navigate(['Home']);
          },
              error=> {
            this.toastr.error(error.message);
          }


      );

    }



  }


}


