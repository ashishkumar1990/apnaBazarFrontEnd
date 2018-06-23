import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';
@Injectable()
export class HomeService {
    private _categoryurl = 'http://localhost/rest/V1/categories?fields=children_data[id,parent_id,name,is_active,position,level,children_data[id,parent_id,name,is_active,position,level]]';
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

    private handleError(error: Response) {
        //console.error(error);
        return Observable.throw(error.json());
    }
}