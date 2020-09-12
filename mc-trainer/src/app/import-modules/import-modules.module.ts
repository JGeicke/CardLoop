import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImportModulesPageRoutingModule } from './import-modules-routing.module';

import { ImportModulesPage } from './import-modules.page';
import {NavbarPageModule} from '../navbar/navbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImportModulesPageRoutingModule,
    NavbarPageModule
  ],
  declarations: [ImportModulesPage]
})
export class ImportModulesPageModule {}
