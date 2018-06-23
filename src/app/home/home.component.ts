import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers:[HomeService]

})

export class HomeComponent implements OnInit {
    categories: any;
    loadCategories:string="Loading Categories...";
    constructor(private _homeService: HomeService,private toastr: ToastrService) {
    }

    ngOnInit() {
        this._homeService.getCategories()
            .subscribe(
                categories => {
                this.categories = categories.children_data;
                this.toastr.success("Categories Loaded Successfully");
                //this._router.navigate(['Home']);
            },
                error=> {
                this.categories =[];
                this.toastr.error(error.message);
            }


        );
    }
}
