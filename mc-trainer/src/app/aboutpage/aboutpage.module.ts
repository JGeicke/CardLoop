import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {AboutpagePageRoutingModule} from './aboutpage-routing.module';

import {AboutpagePage} from './aboutpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AboutpagePageRoutingModule
  ],
  declarations: [AboutpagePage]
})
export class AboutpagePageModule {
}
