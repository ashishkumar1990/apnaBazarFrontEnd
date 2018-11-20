import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule,Routes } from '@angular/router';
import { AppMaterialDesignModule } from '../app.material';
import {ToastModule} from 'primeng/toast';
import {MessagesModule} from 'primeng/messages';

import { HomeComponent } from './home.component';

import { ComponentsModule } from '../components/components.module';


@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule,
        ComponentsModule,
        AppMaterialDesignModule,
        ToastModule,
        MessagesModule
    ],
    declarations: [ HomeComponent ],
    exports:[ HomeComponent ],
    providers: []
})
export class HomeModule { }
