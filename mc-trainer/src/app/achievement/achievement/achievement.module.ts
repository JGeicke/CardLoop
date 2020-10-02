import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {AchievementPageRoutingModule} from './achievement-routing.module';

import {AchievementPage} from './achievement.page';
import {RoundProgressModule} from 'angular-svg-round-progressbar';
import {NavbarPageModule} from "../../navbar/navbar.module";
import {NgxChartsModule} from "@swimlane/ngx-charts";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AchievementPageRoutingModule,
        RoundProgressModule,
        NavbarPageModule,
        NgxChartsModule
    ],
    declarations: [AchievementPage]
})
export class AchievementPageModule {
}
