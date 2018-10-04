import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { CategoryService } from './category.service';
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import * as _ from 'underscore';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
    providers:[]
})
export class CategoryComponent implements OnInit {
    categories: any;
    loadCategories:string="";
    userName:string="";
    constructor(private _categoryService: CategoryService,private toastr: ToastrService,public location: Location,private _router:Router,private _cookie:CookieService) {
    }

    ngOnInit() {

    }

    isCategoryNavBarExists() {
        var title = this.location.prepareExternalUrl(this.location.path());
        if (title === '/apnaBazar' || title === '/apnaBazar/login' || title === '/apnaBazar/signup') {
            return false;
        }
        else {
            let value=this._categoryService.getLoadingValue();
            this.categories=this._categoryService.getValue();
            if (this.categories.length === 0 && !value) {
                let previousUrl = this._cookie.get('previousUrl');
                if (title === "/apnaBazar/home" && previousUrl === "apnaBazar/home") {
                    this._cookie.put('previousUrl', "apnaBazar/category");
                    this._router.navigate(['/category']);
                }
                this.getAllCategories();
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

                    this.toastr.success("Categories Loaded Successfully");
                    this._categoryService.setValue(categoriesData);
                    this.categories = this._categoryService.getValue();
                   let customerDetail= this._cookie.get('customerDetail');
                    if (customerDetail) {
                        let customer = JSON.parse(customerDetail);
                        if (customer) {
                            this.userName = this.userName + customer.firstname + " " + customer.lastname;
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
