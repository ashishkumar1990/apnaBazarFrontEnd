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
export class CartService {
    private _quoteIdurl = 'http://localhost/apnaBazar/rest/V1/carts/mine';
    private _addCartItemurl = 'http://localhost/apnaBazar/rest/V1/carts/mine/items';
    private _removeCartItemurl = 'http://localhost/apnaBazar/rest/V1/carts/mine/items/';
    private _getCustomerCartData = 'http://localhost/apnaBazar/rest/V1/carts/mine';
    private _updateCartItem = 'http://localhost/apnaBazar/rest/V1/carts/mine/items/';
    private cartItemCount;

    constructor(private _http: Http,private _cookie:CookieService){}

    quoteId() {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept'      : 'application/json',
        });
        let options = new RequestOptions({headers: headers});
        let tokenData=this._cookie.get("customerToken");
        options.headers.set("authorization", tokenData);
        return this._http.post(this._quoteIdurl,null,options)
            .map((response: Response) =>response.json())
            .catch(this.handleError);
    }

    addCartItem(cartItem) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept'      : 'application/json',
        });
        let options = new RequestOptions({headers: headers});
        let tokenData=this._cookie.get("customerToken");
        options.headers.set("authorization", tokenData);
        return this._http.post(this._addCartItemurl,cartItem,options)
            .map((response: Response) =>response.json())
            .catch(this.handleError);
    }

    validateCart(product, selectedColor, selectedSize, qty) {
        if ((product.sizes.length > 0 && !selectedSize) && (product.colors.length > 0 && !selectedColor) && (!qty || qty === 0)) {
            return {error: "Please select color,size and qty."};
        }
        if ((product.sizes.length > 0 && !selectedSize) && (product.colors.length > 0 && !selectedColor)) {
            return {error: "Please select color and size."};
        }
        if (product.colors.length > 0 && !selectedColor) {
            return {error: "Please select color."};
        }
        if (product.sizes.length > 0 && !selectedSize) {
            return {error: "Please select size."};
        }
        if (!qty || qty === 0) {
            return {error: "Please select qty."};
        }
    }

    getCustomerCartDetail() {
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json'
            })});
        let tokenData=this._cookie.get("customerToken");
        options.headers.set("authorization", tokenData);
        return this._http.get(this._getCustomerCartData,options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    updateCartItemQuantity(data) {
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json'
            })});
        let tokenData=this._cookie.get("customerToken");
        options.headers.set("authorization", tokenData);
        return this._http.put(this._updateCartItem+data.cart_item.item_id,data,options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    removeCartItem(itemId) {
        let options = new RequestOptions({
            headers: new Headers({
                'Content-Type': 'application/json'
            })});
        let tokenData=this._cookie.get("customerToken");
        options.headers.set("authorization", tokenData);
        return this._http.delete(this._removeCartItemurl+itemId,options)
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    setCartItemCount(count) {
        return this.cartItemCount = count;
    }
    getCartItemCount() {
        return this.cartItemCount ;
    }
    private handleError(error: Response) {
        //console.error(error);
        return Observable.throw(error.json());
    }
}