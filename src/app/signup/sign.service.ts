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
export class SignService {
    private _checkEmailurl = 'http://localhost/rest/V1/customers/isEmailAvailable';
    private _addCustomeryurl = 'http://localhost/rest/V1/customers/';
    constructor(private _http: Http){}

    checkEmailAvailable(emailData) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept'      : 'application/json',
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
        return this._http.post(this._addCustomeryurl,customerData,options)
            .map((response: Response) =>response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        //console.error(error);
        return Observable.throw(error.json());
    }
}
