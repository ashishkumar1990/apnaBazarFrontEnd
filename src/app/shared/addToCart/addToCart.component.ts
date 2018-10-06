import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { CategoryService } from '../category/category.service';
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import * as _ from 'underscore';

@Component({
    providers:[]
})
export class addToCartComponent implements OnInit {
    categories: any;
    loadCategories:string="";
    userName:string="";
    cartItemCount:number=0;
    constructor(private _categoryService: CategoryService,private toastr: ToastrService,public location: Location,private _router:Router,private _cookie:CookieService) {
    }

    ngOnInit() {

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

                    this.toastr.success("Categories Loaded Successfully");
                    this._categoryService.setValue(categoriesData);
                    this.categories = this._categoryService.getValue();
                   let customerDetail= this._cookie.get('customerDetail');
                    if (customerDetail) {
                        let customer = JSON.parse(customerDetail);
                        if (customer) {
                            this.userName = customer.firstname + " " + customer.lastname;
                            console.log(this.userName);
                        }
                    }
                    let previousUrl=  this._cookie.get('previousUrl');
                    if (previousUrl === "apnaBazar/category" || previousUrl === "apnaBazar/login" || previousUrl === "apnaBazar") {
                        this._router.navigate(['/home']);
                    }
                    console.log(this.userName);
                    this.loadCategories = "";
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


}
