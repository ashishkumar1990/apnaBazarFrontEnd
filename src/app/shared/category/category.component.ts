import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { CategoryService } from './category.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
    providers:[CategoryService]
})
export class CategoryComponent implements OnInit {
    categories: any;
    loadCategories:string="Loading Categories...";
    constructor(private _categoryService: CategoryService,private toastr: ToastrService,public location: Location, private element : ElementRef) {
    }

    ngOnInit() {
        var title = this.location.prepareExternalUrl(this.location.path());
        if (title === '/apnaBazar/login' || title === '/apnaBazar/signup') {
            this.loadCategories="";
            return false;
        }
        else {
            this._categoryService.getCategories()
                .subscribe(
                    categories => {
                    this.categories = categories.children_data;
                    this.toastr.success("Categories Loaded Successfully");
                    //this._router.navigate(['Home']);
                },
                    error=> {
                    this.categories =[];
                        this.loadCategories="";
                    this.toastr.error(error.message);
                }


            );
        }

    }

    isCategoryNavBarExists() {
        var title = this.location.prepareExternalUrl(this.location.path());
        if( title === '/apnaBazar/login'||title === '/apnaBazar/signup' ) {
            return false;
        }
        else {
            return true;
        }
    }


}
