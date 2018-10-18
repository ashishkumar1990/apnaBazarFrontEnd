import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';
@Injectable()
export class CategoryService {
    private _categoryurl = 'http://localhost/apnaBazar/rest/V1/categories';
    private categories=[];
    private loadCategories="";
    private userName="";
    constructor(private _http: Http){}

    getCategories() {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept'      : 'application/json',
        });
        // headers.append('Authorization', ' Bearer 3sl175yf8v8pec7hjll9v79mt1w0tvpv');

        let options = new RequestOptions({headers: headers});
        return this._http.get(this._categoryurl,options)
            .map((response: Response) =>response.json())
            .catch(this.handleError);
    }
    setValue(val) {
        this.categories = val;
    }

    getValue() {
        return this.categories ;
    }
    setLoadingValue(val) {
        this.loadCategories = val;
    }

    getLoadingValue() {
        return this.loadCategories ;
    }
    setUserName(val) {
        this.userName = val;
    }

    getUserName() {
        return this.userName ;
    }
    private handleError(error: Response) {
        //console.error(error);
        return Observable.throw(error.json());
    }
}