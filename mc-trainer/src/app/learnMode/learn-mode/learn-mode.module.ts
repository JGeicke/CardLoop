import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LearnModePageRoutingModule } from './learn-mode-routing.module';

import { LearnModePage } from './learn-mode.page';
import {ProgressBarModule} from 'angular-progress-bar';
import {NavbarPageModule} from '../../navbar/navbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LearnModePageRoutingModule,
    ProgressBarModule,
    NavbarPageModule
  ],
  declarations: [LearnModePage]
})
export class LearnModePageModule {}
