import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoggedInPageRoutingModule } from './logged-in-routing.module';

import { LoggedInPage } from './logged-in.page';

import {ProgressBarModule} from 'angular-progress-bar';
import {NavbarPageModule} from '../../navbar/navbar.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LoggedInPageRoutingModule,
        ProgressBarModule,
        NavbarPageModule
    ],
  declarations: [LoggedInPage]
})
export class LoggedInPageModule {}
