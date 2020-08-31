import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoggedInPageRoutingModule } from './logged-in-routing.module';

import { LoggedInPage } from './logged-in.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoggedInPageRoutingModule
  ],
  declarations: [LoggedInPage]
})
export class LoggedInPageModule {}
