import { Component, OnInit } from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
//import {VERSION} from '@angular/material';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']

})

export class HomeComponent implements OnInit {
    //public catagories =<any>[];
    //version = VERSION;
    catagories: any;
    constructor(private _http: Http) { }

    ngOnInit() {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept'      : 'application/json',
        });
        // headers.append('Authorization', ' Bearer 3sl175yf8v8pec7hjll9v79mt1w0tvpv');

        let options = new RequestOptions({headers: headers});

         this._http.get('http://localhost/rest/V1/categories?fields=children_data[id,parent_id,name,is_active,position,level,children_data[id,parent_id,name,is_active,position,level]]', options)
            .subscribe(data => {
                 this.catagories = data.json().children_data;
                 console.log(this.catagories);
            });

    }
}
