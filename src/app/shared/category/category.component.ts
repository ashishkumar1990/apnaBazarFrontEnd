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
    loadProducts:string="";
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
            if (!this.categories && !this.loadCategories) {
                this.loadCategories = "Loading Categories...";
                let previousUrl = this._cookie.get('previousUrl');
                if (previousUrl === "apnaBazar/home") {
                    this._cookie.put('previousUrl', "apnaBazar/category");
                    this._router.navigate(['/category']);
                }
                this.getAllCategories();
            }
            return true;
        }
    }

    getAllCategories() {
        this._categoryService.getCategories()
            .subscribe(
                categories => {
                    let categoriesData = _.filter(categories.children_data, function (category) {
                        if (category.children_data && category.children_data.length > 0) {
                            return category;
                        }
                    });
                    this.loadCategories = "";
                    this.toastr.success("Categories Loaded Successfully");
                    this._categoryService.setValue(categoriesData);
                    this.categories = this._categoryService.getValue();
                    let previousUrl=  this._cookie.get('previousUrl');
                    if (previousUrl === "apnaBazar/category") {
                        this._router.navigate(['/home']);
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


}
