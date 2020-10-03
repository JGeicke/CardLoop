import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddModulesPageRoutingModule } from './add-modules-routing.module';

import { AddModulesPage } from './add-modules.page';
import {ProgressBarModule} from "angular-progress-bar";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AddModulesPageRoutingModule,
        ProgressBarModule
    ],
  declarations: [AddModulesPage]
})
export class AddModulesPageModule {}
