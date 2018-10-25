import {
    AfterViewChecked, Component, OnInit,
    ViewChild
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NgbTabset} from "@ng-bootstrap/ng-bootstrap";
import { CookieService } from 'angular2-cookie/services/cookies.service';
import {ProfileService} from './profile.service'
import {CategoryService} from '../shared/category/category.service'
import {ProductDetailService} from '../products/productDetail/product-detail.service'
import {CartService} from '../shared/cart/cart.service'
import { ToastrService } from 'ngx-toastr';
import {AccountInformation,ChangePassword,AddressBook,CartInformation,PaymentInformation} from './intecface';
import * as _ from 'underscore';



@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    providers: [ProductDetailService]
})

export class ProfileComponent implements OnInit, AfterViewChecked {
    selectedTab: string;
    accountInformation:AccountInformation= {
        email:'',
        firstName:'',
        lastName:'',
        disabled:true,
        setAccount:false,
        updatingAccount:false,
    };
    changePassword: ChangePassword = {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        disabled: false,
        updatingPassword: false,
    };
    addressBook: AddressBook = {
        firstName: "",
        lastName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        region: "",
        postcode: "",
        telephone: "",
        disabled: false,
        setAddressBook:false,
        updatingAddressBook: false
    };
    cartInformation: CartInformation = {
        loadingCartItem: false,
        spinnerValue:"",
        setCartInformation:false,
        cartItems: [],
        cartSubTotal: 0,
        checkOutEnable:false
    };
    paymentInformation: PaymentInformation = {
        loadingPaymentInformation: false,
        spinnerValue: "",
        shippingItems: [],
        paymentMethods:[],
        shippingTotalSegments: []
    };
    categories:any;
    @ViewChild('tabs')
    private tabs: NgbTabset;

    constructor(private _activeRoute: ActivatedRoute, private _route: Router,private toastr: ToastrService,private _cookie:CookieService,private _profileService:ProfileService,private _categoryService:CategoryService,private _cartService:CartService,private _productDetailService:ProductDetailService) {
        this._activeRoute.data.subscribe(d => {
            this.selectedTab = d.name;
        });
    }

    ngOnInit(): void {
        this._activeRoute.params.subscribe(
            params => {
                let selectedTab = params['selectedTab'];
                if (selectedTab === "account-information") {
                    this.selectedTab = 'AccountInformation';
                }
                else if(selectedTab === "change-password"){
                    this.selectedTab = 'ChangePassword';
                }
                else if(selectedTab === "address-book-information"){
                    this.selectedTab = 'AddressBook';
                }
                else if(selectedTab === "cart-information"){
                    this.selectedTab = 'CartInformation';
                }
                else if(selectedTab === "orders-information"){
                    this.selectedTab = 'OrdersInformation';
                }
                else if(selectedTab === "cart-checkout"){
                    this.selectedTab = 'CheckOut';
                }
            }
        );
    }

    ngAfterViewChecked(): void {
        if (this.tabs) {
            this.tabs.select(this.selectedTab);
            this.categories= this._categoryService.getCategories();
            this.getSelectedTabData();
        }
    }

    onTabChange($event) {
        let routes = {
            AccountInformation: `/user-profile/account-information`,
            ChangePassword: `/user-profile/change-password`,
            AddressBook: `/user-profile/address-book-information`,
            CartInformation: `/user-profile/cart-information`,
            OrdersInformation: `/user-profile/orders-information`,
            CheckOut: `/user-profile/cart-checkout`,
        };

        this._route.navigateByUrl(routes[$event.nextId]);
    }

    getSelectedTabData(){
        let customerDetail = JSON.parse(this._cookie.get('customerDetail'));
        if(this.selectedTab==="AccountInformation" && customerDetail && !this.accountInformation.setAccount){
            this.accountInformation.firstName=customerDetail.firstname;
            this.accountInformation.lastName=customerDetail.lastname;
            this.accountInformation.email=customerDetail.email;
            this.accountInformation.setAccount=true;
        }
        if (this.selectedTab === "AddressBook" && customerDetail.addresses.length > 0 &&  !this.addressBook.setAddressBook) {
            let address = customerDetail.addresses[0];
            this.addressBook.firstName = address.firstname;
            this.addressBook.lastName = address.lastname;
            this.addressBook.telephone = address.telephone;
            this.addressBook.addressLine1 = address.street[0];
            this.addressBook.addressLine2 = address.street[1];
            this.addressBook.city = address.city;
            this.addressBook.region = address.region.region;
            this.addressBook.postcode = address.postcode;
            this.addressBook.setAddressBook=true;
            this.addressBook.disabled=true;
        }
        if (this.selectedTab === "CartInformation" && this.cartInformation.cartItems.length === 0 && !this.cartInformation.setCartInformation) {
            this.cartInformation.loadingCartItem = true;
            this.cartInformation.spinnerValue="Fetching Cart Information";
            this.cartInformation.setCartInformation = true;
            this.getMyCartInformation();
        }
        if(this.selectedTab === "CheckOut" && !this.cartInformation.checkOutEnable){
            this.loadPaymentOption();
        }
    }
    editAccountInformation(feild){
        if (feild === "accountInformation" && this.accountInformation.disabled) {
            this.accountInformation.disabled=false;
        }
        else{
            this.accountInformation.updatingAccount=true;
            if (! this.accountInformation.email && ! this.accountInformation.firstName && ! this.accountInformation.lastName) {
                this.accountInformation.updatingAccount=false;
                return;
            }
            let data = {
                "customer": {
                    "email":  this.accountInformation.email,
                    "firstname": this.accountInformation.firstName,
                    "lastname":  this.accountInformation.lastName,
                    "storeId": 1,
                    "websiteId": 1
                }
            };
            this._profileService.PutAccountInformation(data)
                .subscribe(
                customer => {
                    this._cookie.put('customerDetail', JSON.stringify(customer));
                    let customerDetail= this._cookie.get('customerDetail');
                    if (customerDetail) {
                        let customer = JSON.parse(customerDetail);
                        if (customer) {
                            let userName = customer.firstname + " " + customer.lastname;
                            this._categoryService.setUserName(userName);
                        }
                    }
                    this.toastr.error("Updated Account Successfully");
                    this.accountInformation.updatingAccount=false;
                    this.accountInformation.disabled=true;
                },
                error => {
                    this.toastr.error(error.message);
                }
            );
        }

    }

    updatePassword() {
        this.changePassword.updatingPassword = true;
        if (!this.changePassword.currentPassword && !this.changePassword.newPassword && !this.changePassword.confirmNewPassword) {
            this.changePassword.updatingPassword = false;
            return;
        }
        let customerPassword = {
            "currentPassword": this.changePassword.currentPassword,
            "newPassword": this.changePassword.confirmNewPassword
        };
        this._profileService.changePassword(customerPassword)
            .subscribe(
                password => {
                    this.toastr.error("Updated Password Successfully");
                    this.changePassword.updatingPassword = false;

                },
                error => {
                    this.toastr.error(error.message);
                }
            );

    }

    updateAddress() {
        if (this.addressBook.setAddressBook && this.addressBook.disabled) {
            this.addressBook.disabled = false;
        }
        else {
            this.addressBook.updatingAddressBook = true;
            if (!this.addressBook.firstName && this.addressBook.lastName && !this.addressBook.telephone && !(this.addressBook.addressLine1 || this.addressBook.addressLine2) && !this.addressBook.city && !this.addressBook.region && !this.addressBook.postcode) {
                this.addressBook.updatingAddressBook = false;
                this.accountInformation.disabled = false;
                return;
            } else {
                let customerDetail = JSON.parse(this._cookie.get('customerDetail'));
                let customerData = {
                    "customer": {
                        "email": customerDetail.email,
                        "firstname": customerDetail.firstname,
                        "lastname": customerDetail.lastname,
                        "websiteId": 1,
                        "addresses": [
                            {
                                "firstname": this.addressBook.firstName,
                                "lastname": this.addressBook.lastName,
                                "street": [
                                    this.addressBook.addressLine1,
                                    this.addressBook.addressLine2
                                ],
                                "city": this.addressBook.city,
                                "region": {
                                    "region": this.addressBook.region
                                },
                                "country_id": "IN",
                                "postcode": this.addressBook.postcode,
                                "telephone": this.addressBook.telephone
                            },
                            {
                                "firstname": this.addressBook.firstName,
                                "lastname": this.addressBook.lastName,
                                "street": [
                                    this.addressBook.addressLine1,
                                    this.addressBook.addressLine2
                                ],
                                "city": this.addressBook.city,
                                "region": {
                                    "region": this.addressBook.region
                                },
                                "country_id": "IN",
                                "postcode": this.addressBook.postcode,
                                "telephone": this.addressBook.telephone
                            }
                        ]
                    }
                };
                this._profileService.PutAccountInformation(customerData)
                    .subscribe(
                        customer => {
                            this._cookie.put('customerDetail', JSON.stringify(customer));
                            let customerDetail = this._cookie.get('customerDetail');
                            if (customerDetail) {
                                let customer = JSON.parse(customerDetail);
                                if (customer) {
                                    let userName = customer.firstname + " " + customer.lastname;
                                    this._categoryService.setUserName(userName);
                                }
                            }
                            this.toastr.success("Updated Address Book Successfully");
                            this.addressBook.updatingAddressBook = false;
                            this.addressBook.disabled = true;
                        },
                        error => {
                            this.toastr.error(error.message);
                        }
                    );
            }
        }


    }

    getMyCartInformation() {
        let $this = this;
        $this._cartService.getCustomerCartDetail()
            .subscribe(
                cart => {
                    let cartData = {
                        itemsCount: cart.items_count
                    };
                    $this._cookie.put('customerCartCount', JSON.stringify(cartData));
                    $this._cartService.setCartItemCount(cartData.itemsCount);
                    if (cart.items_count === 0) {
                        $this.cartInformation.loadingCartItem = false;
                        $this.cartInformation.spinnerValue = "";
                        return;
                    }
                    _.each(cart.items, function (item) {
                        item.subTotal=item.qty*item.price;
                        $this.cartInformation.cartSubTotal=$this.cartInformation.cartSubTotal+item.subTotal;
                        $this._productDetailService.getProductMediaGallery(item.sku)
                            .subscribe(
                                images => {
                                    _.each(images.media_gallery_entries, function (media) {
                                        if (media.types && media.types.length > 0) {
                                            item.image = media.file;
                                        }
                                    });
                                    $this.cartInformation.cartItems.push(item);
                                    if (cart.items.length === $this.cartInformation.cartItems.length) {
                                        $this.cartInformation.loadingCartItem = false;
                                        $this.cartInformation.spinnerValue="";
                                    }
                                },
                                error => {

                                }
                            );

                    });

                },
                error => {
                    this.toastr.error(error.message);
                }
            );
    }

    updateQuantity(item) {
       let $this=this;
        $this.cartInformation.loadingCartItem=true;
        $this.cartInformation.spinnerValue="Updating Item Qty";
        let data = {
            cart_item: _.pick(item, 'item_id', 'sku', 'qty', 'name', 'price', 'product_type', 'quote_id')
        };
        $this._cartService.updateCartItemQuantity(data)
            .subscribe(
                updatedCartItem => {
                    _.each($this.cartInformation.cartItems,function (cartItem) {
                        if (cartItem.item_id === item.item_id) {
                            item.subTotal = updatedCartItem.qty * updatedCartItem.price;
                        }
                    });
                    $this.cartInformation.cartSubTotal=$this.cartInformation.cartSubTotal+updatedCartItem.price;
                    $this.cartInformation.loadingCartItem=false;
                    $this.cartInformation.spinnerValue="";
                    $this.toastr.success("Item quantity updated successfully");
                },
                error => {
                    $this.toastr.error(error.message);
                }
            );

    }

    removeItem(item) {
        let $this=this;
        $this.cartInformation.loadingCartItem=true;
        $this.cartInformation.spinnerValue="Removing Cart Item";
        $this._cartService.removeCartItem(item.item_id)
            .subscribe(
                deletedCartItem => {
                    let deleteItemIndex;
                    _.each($this.cartInformation.cartItems, function (cartItem, index) {
                        if (cartItem.item_id === item.item_id) {
                            deleteItemIndex = index;
                        }
                    });
                    $this.cartInformation.cartItems.splice(deleteItemIndex,1);
                    $this.cartInformation.cartSubTotal=( $this.cartInformation.cartSubTotal-(item.price*item.qty));
                    let getCartItemCount = this._cartService.getCartItemCount();
                    let setCartItemCount = !getCartItemCount||getCartItemCount===null? 0: getCartItemCount - 1;
                    this._cartService.setCartItemCount(setCartItemCount);
                    let cartData = {
                        itemsCount: setCartItemCount
                    };
                    this._cookie.put('customerCartCount', JSON.stringify(cartData));
                    $this.cartInformation.loadingCartItem=false;
                    $this.cartInformation.spinnerValue="";
                    $this.toastr.success(" successfully removed Item from cart ");
                },
                error => {
                    $this.toastr.error(error.message);
                }
            );

    }

    loadPaymentOption() {
        let customer = JSON.parse(this._cookie.get('customerDetail'));
        if (!customer && customer.addresses.length === 0) {
            return;
        }
        this.cartInformation.checkOutEnable=true;
        this._route.navigateByUrl("/user-profile/cart-checkout");
        this.paymentInformation.loadingPaymentInformation=true;
        this.paymentInformation.spinnerValue="Loading Shipping & Payment Methods Information";
        let address = {
            "customer_id": customer.id,
            "region": customer.addresses[0].region.region,
            "region_id": customer.addresses[0].region_id,
            "country_id": customer.addresses[0].country_id,
            "street": customer.addresses[0].street,
            "telephone": customer.addresses[0].telephone,
            "postcode": customer.addresses[0].postcode,
            "city": customer.addresses[0].city,
            "firstname": customer.firstname,
            "lastname": customer.lastname,
            "prefix": "address_",
            "region_code": customer.addresses[0].region.region_code
        };
        let  shippingData = {
            "addressInformation": {
                shippingAddress: {
                    "sameAsBilling": 1
                },
                "billingAddress": {},
                "shipping_method_code": "flatrate",
                "shipping_carrier_code": "flatrate"
            }

        };
        shippingData.addressInformation.billingAddress = _.extend(shippingData.addressInformation.billingAddress, address);
        shippingData.addressInformation.shippingAddress = _.extend(shippingData.addressInformation.shippingAddress, address);
        this._cartService.shippingInformation(shippingData)
            .subscribe(
                checkOut => {
                    _.each(checkOut.totals.items, function (item) {
                        item.base_price_incl_tax = (item.base_price_incl_tax).toFixed(2);
                        item.base_row_total_incl_tax = (item.base_row_total_incl_tax).toFixed(2);
                    });

                    _.each(checkOut.totals.total_segments, function (totalSegment) {
                        totalSegment.value = (totalSegment.value).toFixed(2);
                    });
                    this.toastr.success("Shipping information & Payment methods loaded successfully");
                    this.paymentInformation.paymentMethods=checkOut.payment_methods;
                    this.paymentInformation.shippingItems=checkOut.totals.items;
                    this.paymentInformation.shippingTotalSegments=checkOut.totals.total_segments;
                    this.paymentInformation.loadingPaymentInformation=false;
                    this.cartInformation.spinnerValue="";
                    this.cartInformation.checkOutEnable=true;
                },
                error => {
                    this.toastr.error(error.message);
                }
            );

    }
    createPaymentData(paymentMethod){
        this.paymentInformation.loadingPaymentInformation=true;
        this.paymentInformation.spinnerValue="Loading payment Page";
        let totalAmountSegment=_.findWhere(this.paymentInformation.shippingTotalSegments, {code: "grand_total"});
        let data = {
            "paymentMethod": {
                "method": paymentMethod.code
            }
        };
        let customer = JSON.parse(this._cookie.get('customerDetail'));
        if(!customer){
            return;
        }
        let customerId = customer.id;
        let customerEmail = customer.email;
        let totalPayableAmount = totalAmountSegment.value;
        this._cartService.orderPlaced(data)
            .subscribe(
                orderId => {
                    if (data.paymentMethod.method === "paytm") {
                        let paytmData = {
                            "ORDER_ID": orderId,
                            "CUST_ID": customerId,
                            "TXN_AMOUNT": totalPayableAmount,
                            "CHANNEL_ID": "WEB",
                            "INDUSTRY_TYPE_ID": "Retail",
                            "WEBSITE": "WEB_STAGING"
                        };
                        this._cartService.paymentMethod(paytmData)
                            .subscribe(
                                responseHtml => {
                                   this._cartService.setPaymentHtml(responseHtml);
                                    this.paymentInformation.loadingPaymentInformation=false;
                                    this.paymentInformation.spinnerValue="";
                                    this._route.navigateByUrl(`payment-option/${data.paymentMethod.method}/method`);
                                },
                                error => {
                                    this.toastr.error(error.message);
                                }
                            );
                    }
                },
                error => {
                    this.toastr.error(error.message);
                }
            );

    }
}
