import {Component, OnInit} from '@angular/core';
import {ProductDetailService} from './product-detail.service';
import {ProductsService} from '../products.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router'
import { CategoryService } from '../../shared/category/category.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import * as _ from 'underscore';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product_detail.component.html',
    styleUrls: ['./product_detail.component.scss'],
    providers: [ProductDetailService]

})

export class ProductDetailComponent implements OnInit {
    currentSkuProducts:any;
    currentProduct:any;
    currentFilters:any;
    categories:any;
    selectedColor:"";
    selectedSize:"";
    images:any=[];
    moreInformations:any=[];
    loadProducts: string = "Loading products...";


    constructor(private _cookie:CookieService,private _productsService: ProductsService,private _productDetailService: ProductDetailService, private toastr: ToastrService, private _activeRouter: ActivatedRoute,private _router: Router, private _categoryService:CategoryService) {}

    ngOnInit() {
         this.categories = this._categoryService.getValue();
         let currentProducts = this._productsService.getCurrentProductData();
        if (this.categories.length === 0 && !currentProducts) {
            this._activeRouter.params.subscribe(routeParams => {
                let categoryId = routeParams.currentCategoryId;
                this._cookie.put('previousUrl', this._router.url);
                this._router.navigateByUrl(`category-id/${categoryId}/products`);
                return;
            });
        }
        if(currentProducts){
            this.currentProduct = currentProducts.product;
        this.currentSkuProducts = currentProducts.skuProducts;
        this.currentFilters = currentProducts.filters;
            this.getMediaGallery("");
            this.getMoreInformation();
        }
    }

    getColor(color) {
        if (color) {
            return color;
        } else {
            return "";
        }
    }

    getMediaGallery(color) {
        this.images = [];
        let sku=this.currentProduct.sku;
        if (color) {
            this.selectedColor = color;
            let item = _.findWhere(this.currentSkuProducts.items, {'color': this.selectedColor});
            if (item) {
                sku = item.sku;
            }
        }
        this._productDetailService.getProductMediaGallery(sku)
            .subscribe(
                media => {
                    let mainItemIndex=0;
                    let mainItem;
                    _.each(media.media_gallery_entries, function (media,index) {
                        if (media.types && media.types.length > 0) {
                            mainItem= media;
                            mainItemIndex= index;
                        }
                    });
                    if (mainItem) {
                        media.media_gallery_entries.splice(0, 0, mainItem);
                        media.media_gallery_entries.splice(mainItemIndex+1, 1);
                    }
                    this.images = media.media_gallery_entries;
                },
                error => {

                });
    }


    getMoreInformation() {
        let $this=this;
        _.each($this.currentFilters, function (filter) {
            if (filter.code === "color" || filter.code === "size") {
                return;
            }
               let valueData; let  fillValues; let information={code :filter.code.toUpperCase(),value:""};
            if ($this.currentProduct[filter.code].indexOf(',') > -1) {
                fillValues = $this.currentProduct[filter.code].split(',');
                _.each(fillValues, function (val) {
                    valueData = _.findWhere(filter.filterValues, {'value': val});
                    if (valueData) {
                        information.value = information.value == "" ? valueData.label : information.value + ',' + valueData.label;
                    }
                });
            } else {
                fillValues = $this.currentProduct[filter.code];
                valueData = _.findWhere(filter.filterValues, {'value': fillValues});
                if (valueData) {
                    information.value = valueData.label;
                }
            }
            if(information.value){
                $this.moreInformations.push(information);
            }
        });
    }


}
