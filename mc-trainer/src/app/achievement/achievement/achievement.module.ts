import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {AchievementPageRoutingModule} from './achievement-routing.module';

import {AchievementPage} from './achievement.page';
import {Achievement} from '../../../services/achievement.model';
import {RoundProgressModule} from 'angular-svg-round-progressbar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AchievementPageRoutingModule,
    RoundProgressModule
  ],
  declarations: [AchievementPage]
})
export class AchievementPageModule {
}
