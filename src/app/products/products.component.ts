import {Component, OnInit,ViewChild,Inject} from '@angular/core';
import {ProductsService} from './products.service';
import {ToastrService} from 'ngx-toastr';
import {MessageService} from 'primeng/api';
import {FormsModule, NgForm}  from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router'
import { CategoryService } from '../shared/category/category.service';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { CartService } from '../shared/cart/cart.service';
import {MatDialog} from '@angular/material';
import {MatDialogRef,MAT_DIALOG_DATA} from '@angular/material';

import * as _ from 'underscore';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    providers: [MessageService]

})

export class ProductsComponent implements OnInit {
    path:any  = [];
    currentCategoryName:string;
    products: any;
    categoryProducts: any = [];
    product: { filter: '' };
    currentFillterCode: '';
    currentFillterValue: any;
    currentCategoryId: number;
    allProducts: any;
    categories:any;
    filters: any = [];
    categoryAllProducts: any = [];
    loadProducts: string = "Loading products...";
    mediaImage:string="";
    selectedColor:any;
    selectedSize:any;
    error:string;
    validateProduct:boolean;
    productsForm: NgForm;
    @ViewChild('productsForm') currentForm: NgForm;

    constructor(public dialog: MatDialog,private _cookie:CookieService,private _productsService: ProductsService, private toastr: ToastrService, private _activeRouter: ActivatedRoute,private _router: Router, private _categoryService:CategoryService,private _cartService:CartService,private messageService: MessageService) {
    }

    ngOnInit() {
        this.categories = this._categoryService.getValue();
        this._activeRouter.params.subscribe(routeParams => {
            this.loadProducts = "Loading products...";
            this.currentCategoryId=routeParams.categoryId;
            this._productsService.getCategoryProductsById( this.currentCategoryId)
                .subscribe(
                    products => {
                        this.resetProducts();
                        if (!products.items) {
                            this.messageService.add({severity:'success', summary:'Items', detail:'No items found in that category'});

                            // this.toastr.success("No items found in that category");
                            this.loadProducts = "";
                            return;
                        }
                        _.each(products.items, function (item) {
                            _.each(item.custom_attributes, function (attr) {
                                let attribute = {};
                                attribute[attr.attribute_code] = attr.value;
                                _.extend(item, attribute);
                            });
                            delete item.custom_attributes;
                        });
                        products = _.chain(products.items)
                            .map(function (item) {
                                item.keyToGroup = item.sku.split("-")[0];
                                let data = _.findWhere(products.items, {sku: item.keyToGroup});
                                if (data) {
                                    return item;
                                } else {
                                    item.keyToGroup = item.sku;
                                    return item;
                                }
                            })
                            .groupBy('keyToGroup')
                            .map(function (value, key) {
                                return {sku: key, items: value};
                            })
                            .value();
                        this.allProducts = Object.assign([], products);
                        this.products = this.allProducts;
                        let keys = [];
                        let attribute_setId = (products[0].items[0].attribute_set_id);
                        _.each(this.products, function (product) {
                            if (_.last(product.items).price === 0) {
                                _.last(product.items).price = (product.items[0].price);
                            }
                            _.each(product.items, function (item) {
                                keys = _.union(keys, _.keys(item));
                            });
                        });
                        let $this = this;
                        this._productsService.getCategoryProductsAttributes(attribute_setId)
                            .subscribe(
                                filtersAttributes => {

                                    let matchedFilters = _.filter(filtersAttributes, function (filtersAttribute) {
                                        return _.contains(["color", "size"], filtersAttribute.attribute_code) || filtersAttribute.frontend_input === "multiselect";
                                    });
                                    let filtersByAttributeId = [];
                                    let currentFilters = [];
                                    _.each(matchedFilters, function (matchedFilter) {
                                        if (_.contains(keys, matchedFilter.attribute_code)) {
                                            let currentFilter = {
                                                'name': matchedFilter.attribute_code.split("_")[0],
                                                'code': matchedFilter.attribute_code,
                                                values: []
                                            };
                                            _.each($this.products, (product) => {
                                                _.each(product.items, function (item) {
                                                    if (item[matchedFilter.attribute_code]) {
                                                        currentFilter.values = _.union(currentFilter.values, item[matchedFilter.attribute_code].split(','));
                                                    }
                                                });
                                            });
                                            currentFilters.push(currentFilter);
                                            matchedFilter.options = _.uniq(matchedFilter.options, function (option) {
                                                return option;
                                            });
                                            matchedFilter.attribute_name = matchedFilter.attribute_code;
                                            matchedFilter.attribute_code = matchedFilter.attribute_code.split("_")[0];
                                            filtersByAttributeId.push(matchedFilter);
                                        }
                                    });

                                    _.each(currentFilters, function (fil) {
                                        let filter = {'name': fil.name, 'code': fil.code, filterValues: []};
                                        let data = _.findWhere(filtersByAttributeId, {'attribute_code': fil.name}).options;
                                        _.each(fil.values, function (value) {
                                            let matchedData = _.findWhere(data, {'value': value});
                                            if (matchedData) {
                                                filter.filterValues.push(matchedData);
                                            }
                                        });
                                        $this.filters.push(filter);
                                    });
                                    let colorValues = _.findWhere($this.filters, {'name': 'color'});
                                    if (colorValues) {
                                        colorValues = colorValues.filterValues;
                                    }
                                    let sizeValues = _.findWhere($this.filters, {'name': 'size'});
                                    if (sizeValues) {
                                        sizeValues = sizeValues.filterValues;
                                    }
                                    _.each($this.products, function (product) {
                                        let colors = [];
                                        let sizes = [];
                                        _.each(product.items, function (item) {
                                            if (item.color) {
                                                let color = _.findWhere(colorValues, {'value': item.color});
                                                if (color) {
                                                    colors.push(color);
                                                }
                                            }
                                            if (item.size) {
                                                let size = _.findWhere(sizeValues, {'value': item.size});
                                                if (size) {
                                                    sizes.push(size);
                                                }
                                            }
                                        });
                                        let mainProduct = _.find(product.items, function (item) {
                                            if (item.sku === product.sku) {
                                                item.colors = _.uniq(colors);
                                                item.sizes = _.uniq(sizes);
                                                return item;
                                            }

                                        });
                                        if (mainProduct) {
                                            $this.categoryProducts.push(mainProduct);
                                        }

                                    });
                                    this.allProducts = Object.assign([], $this.products);
                                    $this.categories = this._categoryService.getValue();
                                    if ($this.categories && $this.categories.length > 0) {
                                        $this.path=[];
                                        $this.currentCategoryName="";
                                        this._productsService.getCategoryProductsPath(this.currentCategoryId).subscribe(
                                            data => {
                                                 let pathValues = data.path.split("/");
                                                 $this.path.push({label:'Home',url:"http://localhost:4200/apnaBazar/home"});
                                                $this.currentCategoryName =  data.name;
                                                 let categoryChildren,subChildren;
                                                _.each(pathValues, function (pathValue) {
                                                    if (pathValue === "1" || pathValue === "2") {
                                                        return;
                                                    }

                                                    let category = _.findWhere($this.categories, {'id': Number(pathValue)});
                                                    if (category) {
                                                        $this.path.push({label:category.name,url:"http://localhost:4200/apnaBazar/category-id/"+pathValue+"/products"});
                                                        if (category.children_data.length > 0) {
                                                            categoryChildren = category.children_data;
                                                        }
                                                    }else if(categoryChildren){
                                                        let SubCategory = _.findWhere(categoryChildren, {'id': Number(pathValue)});
                                                        if(SubCategory){
                                                            if (SubCategory.children_data.length > 0) {
                                                                subChildren = SubCategory.children_data;
                                                            }
                                                            $this.path.push({label:SubCategory.name,url:"http://localhost:4200/apnaBazar/category-id/"+pathValue+"/products"});
                                                        }
                                                        else if(subChildren){
                                                            let SubChildCategory = _.findWhere(subChildren, {'id': Number(pathValue)});
                                                            if(SubChildCategory){
                                                                $this.path.push({label:SubChildCategory.name,url:"http://localhost:4200/apnaBazar/category-id/"+pathValue+"/products"});
                                                            }
                                                        }
                                                    }
                                                });
                                                this.messageService.add({severity:'success', summary:'Filters', detail:'Filter loaded successfully'});

                                                // this.toastr.success("Filter loaded successfully");
                                                // this.toastr.success("Category products loaded successfully");
                                                this.messageService.add({severity:'success', summary:'Products', detail:'Category products loaded successfully'});
                                                this.loadProducts = "";
                                                let previousUrl = this._cookie.get('previousUrl');
                                                if (previousUrl.indexOf("product-sku") !== -1) {
                                                    let sku = previousUrl.split("product-sku/")[1];
                                                    let product = _.findWhere(this.categoryProducts, {'sku': sku});
                                                    if (product) {
                                                        this.populateDetailProduct(product);
                                                    }
                                                }
                                            },
                                            error => {

                                            }
                                        );
                                    }


                                },
                                error => {
                                    this.products = [];
                                    this.filters = [];
                                    this.loadProducts = "";
                                    this.toastr.error(error.message);
                                }
                            );
                        //this._router.navigate(['Home']);

                    },
                    error => {
                        this.products = [];
                        this.loadProducts = "";
                        this.toastr.error(error.message);
                    }

                );

        });

    }

    resetFilters() {
        this.currentFillterCode = "";
        this.currentFillterValue = {label: "", value: ""};
        this.categoryProducts = this.categoryAllProducts;
    }

    resetProducts() {
        this.products = [];
        this.categoryProducts = [];
        this.product = {filter: ''};
        this.currentFillterCode = '';
        this.currentFillterValue = {label: "", value: ""};
        this.allProducts = [];
        this.filters = [];
    }

    populateDetailProduct(product) {
        let skuProducts=_.findWhere(this.allProducts, {'sku': product.sku});

        let currentProduct = {skuProducts:skuProducts, product: product, filters: this.filters};
        this._productsService.setCurrentProductData(currentProduct);
         this._router.navigate([`category-id/${this.currentCategoryId}/product-sku/${product.sku}`]);

    }

    populateFilterName(filterName) {
        this.currentFillterCode = filterName;
    }

    populateFilterValue(filterValue) {
        let $this = this;
        if (this.currentFillterValue && !this.currentFillterValue.label) {
            $this.categoryAllProducts = Object.assign([], $this.categoryProducts);
        }
        $this.currentFillterValue = filterValue;
        let filterItems = [];
        _.each($this.allProducts, function (product) {
            let defaultItem = "";
            _.each(product.items, function (item) {
                if (defaultItem) {
                    return;
                }
                if (_.has(item, $this.currentFillterCode) && item[$this.currentFillterCode].indexOf($this.currentFillterValue.value) !== -1) {
                    defaultItem = _.findWhere(product.items, {'sku': product.sku});
                    if (defaultItem) {
                        filterItems.push(defaultItem);
                    } else {
                        filterItems.push(item);
                    }
                }
            });
        });
        $this.categoryProducts = filterItems;
    }

    getColor(color) {
        if (color) {
            return color;
        } else {
            return "";
        }
    }

    getMediaImage(product, color, productsColors) {
        let $this=this;
        $this.mediaImage = "LoadingImage";
        let sku = product.sku;
        let skuProducts = _.findWhere($this.allProducts, {'sku': sku});
        if (color.value) {
            $this.selectedColor = color;
            let item = _.findWhere(skuProducts.items, {'color': $this.selectedColor.value});
            if (item) {
                product.image = item.image;
            }
            _.each(productsColors, function (color) {
                if (color.value === $this.selectedColor.value) {
                    document.getElementById("colorBox_" + color.value + product.sku).className = "selected-color";
                } else {
                    document.getElementById("colorBox_" + color.value + product.sku).className = "unselected-color";
                }

            });
        }
    }

    selectSize(product, size, productsSizes) {
        let $this=this;
        let sku = product.sku;
        let skuProducts = _.findWhere($this.allProducts, {'sku': sku});
        if (size.value) {
            $this.selectedSize = size;
            _.each(productsSizes, function (size) {
                if (size.value === $this.selectedSize.value) {
                    document.getElementById("sizeBox_" + size.value + product.sku).className = "selected-size";
                } else {
                    document.getElementById("sizeBox_" + size.value + product.sku).className = "unselected-size";
                }

            });
        }
    }

    addToCart(product, qty) {
        let response = this._cartService.validateCart(product, this.selectedColor, this.selectedSize, qty);
        if (response && response.error) {
            this.error = response.error;
            this.openDialog();
            return;
        }
        this.validateProduct=true;
        let productSku = product.sku;
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
                        "qty": qty
                    }
                };
                return this._cartService.addCartItem(cartItem).subscribe(
                    cartItem => {
                        this.messageService.add({severity:'success', summary:'Cart', detail:"Item  " + cartItem.name + "  is successfully added in your shopping cart with quantity of " + cartItem.qty});

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

    openDialog(){
        let dialogRef = this.dialog.open(MyDialogBoxComponent, {
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
    templateUrl: './add-cart-error-dialog-box.component.html',
    styleUrls: ['./add-cart-error-dialog-box.component.scss']
})
export class MyDialogBoxComponent implements OnInit {

    constructor(public thisDialogRef:MatDialogRef<MyDialogBoxComponent>,@Inject(MAT_DIALOG_DATA)public data:string) { }

    ngOnInit() {
    }

    onClose(){
        this.thisDialogRef.close("Ok");
    }

}
