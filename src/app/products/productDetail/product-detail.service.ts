import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';
@Injectable()
export class ProductDetailService {
    private _mediaGalleryEntriesUrl ="";
    private _attributesUrl ="";
    constructor(private _http: Http){}

    getProductMediaGallery(sku) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept'      : 'application/json',
        });
        this. _mediaGalleryEntriesUrl = 'http://localhost/apnaBazar/rest/V1/products/'+sku+'?fields=media_gallery_entries';
        let options = new RequestOptions({headers: headers});
        return this._http.get(this._mediaGalleryEntriesUrl,options)
            .map((response: Response) =>response.json())
            .catch(this.handleError);
    }

    getCategoryProductsPath(categoryId) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept'      : 'application/json',
        });
        this. _attributesUrl = 'http://localhost/apnaBazar/rest/V1/categories/' + categoryId+'?fields=path,name';
        let options = new RequestOptions({headers: headers});
        return this._http.get(this._attributesUrl,options)
            .map((response: Response) =>response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        //console.error(error);
        return Observable.throw(error.json());
    }
}