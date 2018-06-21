import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    test : Date = new Date();
    //public loginPage:boolean;

    constructor() { }

    ngOnInit() {
        //this.loginPage=true;
    }
}
