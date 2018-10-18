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
import {AccountInformation,ChangePassword,AddressBook,CartInformation} from './intecface';
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
                    $this.cartInformation.loadingCartItem=false;
                    $this.cartInformation.spinnerValue="";
                    $this.toastr.success(" successfully removed Item from cart ");
                },
                error => {
                    $this.toastr.error(error.message);
                }
            );

    }
}
