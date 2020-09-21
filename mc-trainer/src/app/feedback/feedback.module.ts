import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeedbackPageRoutingModule } from './feedback-routing.module';

import { FeedbackPage } from './feedback.page';
import {NavbarPageModule} from "../navbar/navbar.module";
import {ProgressBarModule} from "angular-progress-bar";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FeedbackPageRoutingModule,
        NavbarPageModule,
        ProgressBarModule
    ],
  declarations: [FeedbackPage]
})
export class FeedbackPageModule {}
