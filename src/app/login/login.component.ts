import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'


//declare const FB:any;
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    constructor(private _router:Router) {
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
        //FB.getLoginStatus(response => {
        //    //this.statusChangeCallback(response);
        //});
    }

    loadHomePage() {
        this._router.navigate(['home']);
    }
}
