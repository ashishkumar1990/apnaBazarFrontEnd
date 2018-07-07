import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'underscore';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers:[HomeService]

})

export class HomeComponent implements OnInit {
    homePageProducts: any;
    loadHomePageProducts:string="Loading HomePage...";
    constructor(private _homeService: HomeService,private toastr: ToastrService) {
    }

    ngOnInit() {
        this._homeService.getHomeProducts()
            .subscribe(
                homePageProducts => {
                    this.homePageProducts= _.each(homePageProducts.items, function (homePageProduct) {
                       let image= _.findWhere(homePageProduct.custom_attributes, {attribute_code: "small_image"});
                        if(image){
                            homePageProduct.image=image.value;
                        }
                    });
                this.toastr.success("Home Page Loaded Successfully");
                //this._router.navigate(['Home']);
            },
                error=> {
                    this.homePageProducts = [];
                    this.loadHomePageProducts = "";
                    this.toastr.error(error.message);
            }


        );
    }
}
