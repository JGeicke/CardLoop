import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModuleListPageRoutingModule } from './module-list-routing.module';

import { ModuleListPage } from './module-list.page';
import {NavbarPageModule} from '../../navbar/navbar.module';
import {ProgressBarModule} from 'angular-progress-bar';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ModuleListPageRoutingModule,
        NavbarPageModule,
        ProgressBarModule
    ],
  declarations: [ModuleListPage]
})
export class ModuleListPageModule {}
