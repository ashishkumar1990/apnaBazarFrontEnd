import {Component, OnInit} from '@angular/core';
import {CookieService} from 'angular2-cookie/services/cookies.service';
import {SignupService} from "../signup/signup.service";
import {CartService} from "../shared/cart/cart.service";
import {ToastrService} from 'ngx-toastr';
import {MessageService} from 'primeng/api';



@Component({
    selector: 'app-payment-status',
    templateUrl: './payment-status.component.html',
    styleUrls: ['./payment-status.component.scss'],
    providers:[MessageService]
})
export class PaymentStatusComponent implements OnInit {
    transaction: any;
    paymentMethod: any;
    ORDER_ID: any;
    TXN_AMOUNT: any;
    TXN_ID: any;
    BANKTXN_ID: any;
    STATUS: any;
    GATEWAYNAME: any;
    TXNDATE: any;
    scooterLeft = -200;
    timer:any;

    constructor(private _cookie: CookieService, private _cartService: CartService, private _signupService: SignupService, private toastr: ToastrService,private messageService: MessageService) {
    }

    ngOnInit() {
        if (this._cookie.get('transactionDetails')) {
            let transactionDetails = JSON.parse(this._cookie.get('transactionDetails'));
            if (transactionDetails) {
                transactionDetails = transactionDetails.data;
                if (transactionDetails.PAYMENTMODE === 'PPI') {
                    this.transaction = transactionDetails;
                    this.paymentMethod = "paytm";
                    this.ORDER_ID = transactionDetails.ORDERID;
                    this.TXN_AMOUNT = transactionDetails.TXNAMOUNT;
                    this.TXN_ID = transactionDetails.TXNID;
                    this.BANKTXN_ID = transactionDetails.BANKTXNID;
                    this.STATUS = transactionDetails.STATUS;
                    this.GATEWAYNAME = transactionDetails.GATEWAYNAME;
                    this.TXNDATE = transactionDetails.TXNDATE;
                }
                // } else if (Transaction.transactionDetails.paymentMethod === 'instamojo') {
                //   $scope.paymentMethod = Transaction.transactionDetails.paymentMethod;
                //   $scope.payment_id = Transaction.transactionDetails.payment_id;
                //   $scope.payment_request_id = Transaction.transactionDetails.payment_request_id;
                // }
                // else if (Transaction.transactionDetails.paymentMethod === 'razorPay') {
                //   $scope.paymentMethod = Transaction.transactionDetails.paymentMethod;
                //   $scope.payment_id = Transaction.transactionDetails.id;
                //   $scope.status = Transaction.transactionDetails.status;
                //   $scope.service_tax = Transaction.transactionDetails.service_tax/100;
                //   $scope.fee = Transaction.transactionDetails.fee/100;
                //   $scope.orderId = Transaction.transactionDetails.notes.shopping_order_id;
                // }
                else {
                    this.paymentMethod = transactionDetails.paymentMethod;
                    this.ORDER_ID = transactionDetails.orderId;
                }
            }
        }
        // else {
        //   return {
        //     "orderId": "",
        //     "paymentMethod": ""
        //
        //   };
        // }
        let tokenData = this._cookie.get("customerToken");
        this._signupService.customerCartCreate(tokenData)
            .subscribe(
                cart => {
                    console.log(cart);
                    let setCartItemCount = 0;
                    this._cartService.setCartItemCount(setCartItemCount);
                    let cartData = {
                        itemsCount: setCartItemCount
                    };
                    this._cookie.put('customerCartCount', JSON.stringify(cartData));
                    this.messageService.add({severity:'success', summary:'Cart', detail:'Customer cart created Successfully'});

                    // this.toastr.success("customer cart created Successfully");
                },
                error => {
                    this.toastr.error(error.message);
                }
            );

        //Run Scooter
        this.runScooter();
    }

    runScooter() {
        let scooter = document.getElementById("scooter");
        if(!scooter){
            return;
        }
        if (this.scooterLeft >= 500) {
            this.scooterLeft = -200;
        }
        else {
            this.scooterLeft += 7;
        }
        this.timer = setTimeout(() => {
            scooter.style.left = this.scooterLeft + "px";
            this.runScooter();
        }, 100)
    }

    ngOnDestroy(){
        clearTimeout(this.timer);
    }

}
