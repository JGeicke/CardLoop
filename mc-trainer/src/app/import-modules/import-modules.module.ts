import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImportModulesPageRoutingModule } from './import-modules-routing.module';

import { ImportModulesPage } from './import-modules.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImportModulesPageRoutingModule
  ],
  declarations: [ImportModulesPage]
})
export class ImportModulesPageModule {}
