import {Component, OnInit,ViewChild,Inject} from '@angular/core';
import {ProductDetailService} from './product-detail.service';
import {ProductsService} from '../products.service';
import {ToastrService} from 'ngx-toastr';
import {MessageService} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router'
import {CategoryService} from '../../shared/category/category.service';
import {CookieService} from 'angular2-cookie/services/cookies.service';
import {CartService} from '../../shared/cart/cart.service';
import {MatDialog} from '@angular/material';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material';
import {FormsModule, NgForm}  from '@angular/forms';


import * as _ from 'underscore';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product_detail.component.html',
    styleUrls: ['./product_detail.component.scss'],
    providers: [ProductDetailService,MessageService]

})

export class ProductDetailComponent implements OnInit {
    currentSkuProducts: any;
    currentProduct: any;
    currentFilters: any;
    categories: any;
    images: any = [];
    moreInformations: any = [];
    selectedColor:any;
    selectedSize:any;
    error:string;
    addCart={qty:""};
    validateProduct:boolean;
    productDetailForm: NgForm;
    @ViewChild('productDetailForm') currentForm: NgForm;

    constructor(public dialog: MatDialog,private _cookie: CookieService, private _productsService: ProductsService, private _productDetailService: ProductDetailService, private toastr: ToastrService, private _activeRouter: ActivatedRoute, private _router: Router, private _categoryService: CategoryService, private _cartService: CartService,private messageService: MessageService) {
    }

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
        if (currentProducts) {
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

    setColor(selectedColor){
        let $this=this;
        $this.selectedColor = selectedColor;
        _.each(this.currentProduct.colors, function (color) {
            if (color.value === $this.selectedColor.value) {
                document.getElementById("colorBox_" + color.value + $this.currentProduct.sku).className = "selected-color";
            } else {
                document.getElementById("colorBox_" + color.value + $this.currentProduct.sku).className = "unselected-color";
            }

        });
    }

    getMediaGallery(color) {
        let sku = this.currentProduct.sku;
        if (color) {
            this.setColor(color);
            let item = _.findWhere(this.currentSkuProducts.items, {'color': color.value});
            if (item) {
                sku = item.sku;
            }
        }
        this.images = [];
        this._productDetailService.getProductMediaGallery(sku)
            .subscribe(
                media => {
                    let mainItemIndex = 0;
                    let mainItem;
                    _.each(media.media_gallery_entries, function (media, index) {
                        if (media.types && media.types.length > 0) {
                            mainItem = media;
                            mainItemIndex = index;
                        }
                    });
                    if (mainItem) {
                        media.media_gallery_entries.splice(0, 0, mainItem);
                        media.media_gallery_entries.splice(mainItemIndex + 1, 1);
                    }
                    this.images = media.media_gallery_entries;
                },
                error => {

                });
    }


    getMoreInformation() {
        let $this = this;
        _.each($this.currentFilters, function (filter) {
            if (filter.code === "color" || filter.code === "size") {
                return;
            }
            let valueData;
            let fillValues;
            let information = {code: filter.code.toUpperCase(), value: ""};
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
            if (information.value) {
                $this.moreInformations.push(information);
            }
        });
    }

    selectSize(size) {
        let $this=this;
        let sku = this.currentProduct.sku;
        if (size.value) {
            $this.selectedSize = size;
            _.each(this.currentProduct.sizes, function (size) {
                if (size.value === $this.selectedSize.value) {
                    document.getElementById("sizeBox_" + size.value + $this.currentProduct.sku).className = "selected-size";
                } else {
                    document.getElementById("sizeBox_" + size.value + $this.currentProduct.sku).className = "unselected-size";
                }

            });
        }
    }

    addToCart() {
        let response = this._cartService.validateCart(this.currentProduct, this.selectedColor, this.selectedSize, this.addCart.qty);
        if (response && response.error) {
            this.error = response.error;
            this.openDialog();
            return;
        }
        this.validateProduct=true;
        let productSku = this.currentProduct.sku;
        if (this.selectedSize) {
            productSku = productSku + "-" + this.selectedSize.label;
        }
        if (this.selectedColor) {
            productSku = productSku + "-" + this.selectedColor.label;
        }
        this._cartService.quoteId().subscribe(
            quoteId => {
                let cartItem = {
                    "cart_item": {
                        "quote_id": quoteId,
                        "sku": productSku,
                        "qty": this.addCart.qty
                    }
                };
                return this._cartService.addCartItem(cartItem).subscribe(
                    cartItem => {
                        this.messageService.add({severity:'success', summary:'Cart', detail:'"Item  " + cartItem.name + "  is successfully added in your shopping cart with quantity of " + cartItem.qty'});

                        // this.toastr.success("Item  " + cartItem.name + "  is successfully added in your shopping cart with quantity of " + cartItem.qty);
                            let getCartItemCount = this._cartService.getCartItemCount();
                            let setCartItemCount = !getCartItemCount||getCartItemCount===null? 1: getCartItemCount + 1;
                            this._cartService.setCartItemCount(setCartItemCount);
                            let cartData = {
                                itemsCount: setCartItemCount
                            };
                            this._cookie.put('customerCartCount', JSON.stringify(cartData));
                        this.validateProduct=false;
                        return {cartItem: cartItem};
                    },
                    error => {
                        return {error: "Please select qty."};
                    });
            },
            error => {
                return {error: "Please select qty."};
            });
        // this.toastr.success("done");
    }

    openDialog() {
        let dialogRef = this.dialog.open(CartValidationComponent, {
            width: '380px',
            data: this.error
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed');
            // this.animal = result;
        });
    }
}

@Component({
    selector: 'app-my-dialog-box',
    templateUrl: '../add-cart-error-dialog-box.component.html',
    styleUrls: ['../add-cart-error-dialog-box.component.scss']
})
export class CartValidationComponent implements OnInit {

    constructor(public thisDialogRef: MatDialogRef<CartValidationComponent>, @Inject(MAT_DIALOG_DATA) public data: string) {
    }

    ngOnInit() {
    }

    onClose() {
        this.thisDialogRef.close("Ok");
    }

}


