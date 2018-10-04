/**
 * Created by akumar on 23-06-2018.
 */
import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';
@Injectable()
export class SignupService {
    private _checkEmailurl = 'http://localhost/apnaBazar/rest/V1/customers/isEmailAvailable';
    private _createCustomerurl = 'http://localhost/apnaBazar/rest/V1/customers/';
    private _getCustomerToken = 'http://localhost/apnaBazar/rest/V1/integration/customer/token';
    private _createCustomerCart = 'http://localhost/apnaBazar/rest/V1/carts/mine';
    constructor(private _http: Http){}

    checkEmailAvailable(emailData) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept'      : 'application/json'
        });
        // headers.append('Authorization', ' Bearer 3sl175yf8v8pec7hjll9v79mt1w0tvpv');

        let options = new RequestOptions({headers: headers});
        return this._http.post(this._checkEmailurl,emailData,options)
            .map((response: Response) =>response.json())
            .catch(this.handleError);
    }

    createCustomer(customerData) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept'      : 'application/json',
        });
        // headers.append('Authorization', ' Bearer 3sl175yf8v8pec7hjll9v79mt1w0tvpv');

        let options = new RequestOptions({headers: headers});
        return this._http.post(this._createCustomerurl,customerData,options)
            .map((response: Response) =>response.json())
            .catch(this.handleError);
    }

    getCustomerToken(user) {
        return this._http.post(this._getCustomerToken,user)
            .map((response: Response) =>response.json())
            .catch(this.handleError);
    }

    customerCartCreate(tokenData) {
        let options = new RequestOptions({
            headers: new Headers({
            'Content-Type': 'application/json'
        })});
        options.headers.set("authorization", tokenData);
        return this._http.post(this._createCustomerCart, null,options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        //console.error(error);
        return Observable.throw(error.json());
    }
}
