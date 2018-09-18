import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { CategoryService } from './category.service';
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import * as _ from 'underscore';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
    providers:[CategoryService]
})
export class CategoryComponent implements OnInit {
    categories: any;
    loadCategories:string="";
    loadProducts:string="";
    constructor(private _categoryService: CategoryService,private toastr: ToastrService,public location: Location,private _router:Router) {
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
                this.getAllCategories();
            }
            return true;
        }
    }

    getAllCategories() {
        this._categoryService.getCategories()
            .subscribe(
                categories => {
                    let categoriesData = categories.children_data;
                    this.categories = _.filter(categoriesData, function (category) {
                        if (category.children_data && category.children_data.length > 0) {
                            return category;
                        }
                    });
                    this.loadCategories = "";
                    this.toastr.success("Categories Loaded Successfully");
                    //this._router.navigate(['Home']);
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
