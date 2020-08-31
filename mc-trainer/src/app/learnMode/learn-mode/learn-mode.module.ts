import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LearnModePageRoutingModule } from './learn-mode-routing.module';

import { LearnModePage } from './learn-mode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LearnModePageRoutingModule
  ],
  declarations: [LearnModePage]
})
export class LearnModePageModule {}
