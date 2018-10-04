/**
 * Created by akumar on 04-10-2018.
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
export class LoginService {
    private _getCustomerToken = 'http://localhost/apnaBazar/rest/V1/integration/customer/token';
    private _getCustomerData = 'http://localhost/apnaBazar/rest/V1/customers/me';
    private _getCustomerCartData = 'http://localhost/apnaBazar/rest/V1/carts/mine';


    constructor(private _http: Http){}

    getCustomerToken(user) {
        return this._http.post(this._getCustomerToken,user)
            .map((response: Response) =>response.json())
            .catch(this.handleError);
    }

    getCustomerDetail(tokenData) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        });
        let options = new RequestOptions({headers: headers});
        options.headers.set("authorization", tokenData);
        return this._http.get(this._getCustomerData, options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }


    getCustomerCartDetail(tokenData) {
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json'
            })});
        options.headers.set("authorization", tokenData);
        return this._http.get(this._getCustomerCartData,options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        //console.error(error);
        return Observable.throw(error.json());
    }
}

