import {Component, OnInit} from '@angular/core';
import {ProductsService} from './products.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router'
import * as _ from 'underscore';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    providers: [ProductsService]

})

export class ProductsComponent implements OnInit {
    products: any;
    categoryProducts: any = [];
    product: { filter: '' };
    currentFillterCode: '';
    currentFillterValue: any;
    currentProduct: any;
    currentCategoryProducts: any;
    allProducts: any;
    filters: any = [];
    categoryAllProducts: any = [];
    loadProducts: string = "Loading products...";

    constructor(private _productsService: ProductsService, private toastr: ToastrService, private _route: ActivatedRoute) {
    }

    ngOnInit() {
        this._route.params.subscribe(routeParams => {
            this.loadProducts = "Loading products...";
            this._productsService.getCategoryProductsById(routeParams.categoryId)
                .subscribe(
                    products => {
                        this.resetProducts();
                        if (!products.items) {
                            this.toastr.success("No items found in that category");
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
                                    this.toastr.success("Filter loaded successfully");
                                    this.toastr.success("Category products loaded successfully");
                                    this.loadProducts = "";

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
        this.currentProduct = [];
        this.currentCategoryProducts = [];
        this.allProducts = [];
        this.filters = [];
    }

    populateProducts(product) {
        this.currentProduct = {sku: product.sku, price: product.price, filters: this.filters};
        this.currentCategoryProducts = _.findWhere(this.allProducts, {'sku': product.sku});
        //$state.go('ocart.product.productDetail', {sku: product.sku});
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

    loadProductDetails(product, color, size) {
        let $this=this;
        $this.categoryProducts=this.allProducts;
    }

}
