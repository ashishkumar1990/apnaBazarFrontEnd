import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute,Router } from '@angular/router'
import * as _ from 'underscore';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    providers:[ProductsService]

})

export class ProductsComponent implements OnInit {
    products: any;
    loadProducts:string="Loading products...";
    constructor(private _productsService: ProductsService,private toastr: ToastrService,private _route: ActivatedRoute) {
    }

    ngOnInit() {
        let categoryId=this._route.snapshot.params['categoryId'];
        this._productsService.getCategoryProductsById(categoryId)
            .subscribe(
                products => {
                    this.products= _.each(products.items, function (product) {
                       let image= _.findWhere(product.custom_attributes, {attribute_code: "small_image"});
                        if(image){
                            product.image=image.value;
                        }
                    });
                this.toastr.success("Products Loaded Successfully");
                //this._router.navigate(['Home']);
            },
                error=> {
                    this.products = [];
                    this.loadProducts = "";
                    this.toastr.error(error.message);
            }


        );
    }
}
