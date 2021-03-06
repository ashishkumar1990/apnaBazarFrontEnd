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
    private _homeProductUrl = 'http://localhost/apnaBazar/rest/V1/products?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=38&searchCriteria[filter_groups][0][filters][0][condition_type]=in&&fields=items[name,sku,price,attribute_set_id,custom_attributes]';
    constructor(private _http: Http){}

    getHomeProducts() {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept'      : 'application/json',
        });
        let options = new RequestOptions({headers: headers});
        return this._http.get(this._homeProductUrl,options)
            .map((response: Response) =>response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        //console.error(error);
        return Observable.throw(error.json());
    }
}