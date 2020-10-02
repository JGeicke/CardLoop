import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {OnboardingPageRoutingModule} from './onboarding-routing.module';

import {OnboardingPage} from './onboarding.page';
import {NavbarPageModule} from "../navbar/navbar.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        OnboardingPageRoutingModule,
        NavbarPageModule
    ],
    declarations: [OnboardingPage]
})
export class OnboardingPageModule {
}
