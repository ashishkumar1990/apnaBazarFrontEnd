import { Component, OnInit  } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { CategoryService } from './category.service';
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import {MessageService} from 'primeng/api';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { CartService } from '../cart/cart.service';

import * as _ from 'underscore';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
    providers:[MessageService]
})
export class CategoryComponent implements OnInit {
    categories: any;
    loadCategories:string="";
    userName:string="";
    cartItemCount:string="";
    constructor(private _categoryService: CategoryService,private toastr: ToastrService,public location: Location,private _router:Router,private _cookie:CookieService,private _cartService:CartService,private messageService: MessageService) {
    }

    ngOnInit() {

    }

    isCategoryNavBarExists() {
        var title = this.location.prepareExternalUrl(this.location.path());
        if (title === '/apnaBazar' || title === '/apnaBazar/login' || title === '/apnaBazar/signup') {
            return false;
        }
        if (title === "/apnaBazar/category") {
            this._router.navigate(['/home']);
        }
        else {
            let value=this._categoryService.getLoadingValue();
            this.categories=this._categoryService.getValue();
            if (this.categories.length === 0 && !value) {
                let previousUrl = this._cookie.get('previousUrl');
                if (title === "/apnaBazar/home" && previousUrl === "apnaBazar/home") {
                    this._cookie.put('previousUrl', "apnaBazar/category");
                    this._router.navigate(['/category']);
                    return false;
                }
                this.getAllCategories();
            }
            if (this.categories.length > 0) {
                let customerDetail = this._cookie.get('customerDetail');
                if (customerDetail) {
                    let customer = JSON.parse(customerDetail);
                    if (customer) {
                        let userName = customer.firstname + " " + customer.lastname;
                        this._categoryService.setUserName(userName);
                        this.userName= this._categoryService.getUserName();
                    }
                }
                let customerCartCount = this._cookie.get('customerCartCount');
                if (this._cookie.get('customerCartCount')) {
                    let cart = JSON.parse(customerCartCount);
                    if (cart) {
                        this.cartItemCount = this._cartService.setCartItemCount(cart.itemsCount);
                        this.cartItemCount = this._cartService.getCartItemCount();
                    }
                }
            }
            return true;
        }
    }

    getAllCategories() {
        this._categoryService.setLoadingValue("Loading Categories...");
        this.loadCategories = this._categoryService.getLoadingValue();
        this._categoryService.getCategories()
            .subscribe(
                categories => {
                    let categoriesData = _.filter(categories.children_data, function (category) {
                        if (category.children_data && category.children_data.length > 0) {
                            return category;
                        }
                    });
                    this.messageService.add({severity:'success', summary:'Categories', detail:'Categories Loaded Successfully'});

                    // this.toastr.success("Categories Loaded Successfully");
                    this._categoryService.setValue(categoriesData);
                    this.categories = this._categoryService.getValue();
                   let customerDetail= this._cookie.get('customerDetail');
                    if (customerDetail) {
                        let customer = JSON.parse(customerDetail);
                        if (customer) {
                            let userName = customer.firstname + " " + customer.lastname;
                            this._categoryService.setUserName(userName);
                           this.userName= this._categoryService.getUserName();
                            console.log(this.userName);
                        }
                    }
                    let  customerCartCount=this._cookie.get('customerCartCount');
                    if(this._cookie.get('customerCartCount')){
                        let cart = JSON.parse(customerCartCount);
                        if (cart && !this.cartItemCount) {
                            this.cartItemCount = this._cartService.setCartItemCount(cart.itemsCount);
                            this.cartItemCount = this._cartService.getCartItemCount();
                        }
                    }
                    this.loadCategories = "";
                    let previousUrl=  this._cookie.get('previousUrl');
                    if (previousUrl === "apnaBazar/category"  || previousUrl === "apnaBazar/login" || previousUrl === "apnaBazar/signup"|| previousUrl === "apnaBazar") {
                        this._router.navigate(['/category']);
                    }

                },
                error => {
                    this.categories = [];
                    this.loadCategories = "";
                    this.toastr.error(error.message);
                }
            );
    }


    getCategoryProducts(subCategory) {
        this._router.navigateByUrl(`category-id/${subCategory.id}/products`);
    }

    signOut() {
        this._cookie.removeAll();
        this._router.navigateByUrl(`/login`);
    }

}
