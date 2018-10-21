/**
 * Created by akumar on 14-10-2018.
 */

export class AccountInformation {
    email:string;
    firstName:string;
    lastName:string;
    disabled:boolean;
    setAccount:boolean;
    updatingAccount:boolean;
}
export class ChangePassword {
    currentPassword:string;
    newPassword:string;
    confirmNewPassword:string;
    disabled:boolean;
    updatingPassword:boolean;
}

export class AddressBook {
    firstName:string;
    lastName:string;
    addressLine1:string;
    addressLine2:string;
    city:string;
    region:string;
    postcode:string;
    telephone:string;
    disabled:boolean;
    setAddressBook:boolean;
    updatingAddressBook:boolean;
}

export class CartInformation {
    loadingCartItem: boolean;
    spinnerValue:string;
    setCartInformation:boolean;
    cartItems: any;
    cartSubTotal: number;
    checkOutEnable:boolean;
}
export class PaymentInformation {
    loadingPaymentInformation: boolean;
    spinnerValue:string;
    paymentMethods:any;
    shippingItems:any;
    shippingTotalSegments: any;
}