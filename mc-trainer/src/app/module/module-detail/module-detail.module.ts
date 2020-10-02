import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModuleDetailPageRoutingModule } from './module-detail-routing.module';

import { ModuleDetailPage } from './module-detail.page';
import {ProgressBarModule} from "angular-progress-bar";
import {NavbarPageModule} from "../../navbar/navbar.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ModuleDetailPageRoutingModule,
        ProgressBarModule,
        NavbarPageModule
    ],
  declarations: [ModuleDetailPage]
})
export class ModuleDetailPageModule {}
