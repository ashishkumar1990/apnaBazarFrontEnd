/**
 * Created by Ashish Kumar on 14-10-2018.
 */
import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'angular2-cookie/services/cookies.service';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';
@Injectable()
export class ProfileService {
    private _putCustomerurl = 'http://localhost/apnaBazar/rest/V1/customers/me';
    private _changePasswordurl = 'http://localhost/apnaBazar/rest/V1/customers/me/password';
    private cartItemCount;
    constructor(private _http: Http,private _cookie:CookieService){}

    PutAccountInformation(customerData) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept'      : 'application/json',
        });
        let options = new RequestOptions({headers: headers});
        let tokenData=this._cookie.get("customerToken");
        options.headers.set("authorization", tokenData);
        return this._http.put(this._putCustomerurl,customerData,options)
            .map((response: Response) =>response.json())
            .catch(this.handleError);
    }

    changePassword(customerPassword) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept'      : 'application/json',
        });
        let options = new RequestOptions({headers: headers});
        let tokenData=this._cookie.get("customerToken");
        options.headers.set("authorization", tokenData);
        return this._http.put(this._changePasswordurl,customerPassword,options)
            .map((response: Response) =>response.json())
            .catch(this.handleError);
    }
    private handleError(error: Response) {
        //console.error(error);
        return Observable.throw(error.json());
    }

}
