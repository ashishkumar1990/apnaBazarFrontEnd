import { Component, OnInit } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import {SignupService} from "../signup/signup.service";
import {ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss']
})
export class PaymentStatusComponent implements OnInit {
  transaction :any;
  paymentMethod :any;
  ORDER_ID :any;
  TXN_AMOUNT :any;
  TXN_ID:any;
  BANKTXN_ID :any;
  STATUS :any;
  GATEWAYNAME :any;
  TXNDATE:any;
  constructor(private _cookie:CookieService,private _signupService: SignupService,private toastr: ToastrService) { }

  ngOnInit() {
    if (this._cookie.get('transactionDetails')) {
      let transactionDetails = JSON.parse(this._cookie.get('transactionDetails'));
      if (transactionDetails) {
        transactionDetails = transactionDetails.data;
        if (transactionDetails.paymentMethod === 'paytm') {
          this.transaction = transactionDetails;
          this.paymentMethod = transactionDetails.paymentMethod;
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
    let tokenData=this._cookie.get("customerToken");
    this._signupService.customerCartCreate(tokenData)
        .subscribe(
            cart => {
              console.log(cart);
              this.toastr.success("customer cart created Successfully");
            },
            error => {
              this.toastr.error(error.message);
            }
        );
  }

}
