import {Component, OnInit} from "@angular/core";
import {CartService} from "../shared/cart/cart.service";
import {SignupService} from "../signup/signup.service";
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute,Router} from '@angular/router';
import { CookieService } from 'angular2-cookie/services/cookies.service';


@Component({
    selector: 'app-payment-option',
    templateUrl: './payment-option.component.html',
    styleUrls: ['./payment-option.component.scss']
})

export class PaymentOptionComponent implements OnInit {
    responseData: any;

    constructor(private _cookie: CookieService,private _activeRouter: ActivatedRoute, private _router: Router,private _cartService: CartService,private _signupService: SignupService,private toastr: ToastrService) {
    }

    ngOnInit() {
        this._activeRouter.params.subscribe(routeParams => {
            if(routeParams.methodType==='paytm'){
                this.responseData = this._cartService.getPaymentHtml();
                setTimeout(function() {
                    var script = document.createElement('script');
                    script.type = "text/javascript";
                    script.innerHTML = "document.f1.submit();";
                    document.body.appendChild(script);
                }, 5);
            }
        });
    }
}
