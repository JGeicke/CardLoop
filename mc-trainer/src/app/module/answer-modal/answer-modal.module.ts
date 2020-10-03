import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnswerModalPageRoutingModule } from './answer-modal-routing.module';

import { AnswerModalPage } from './answer-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnswerModalPageRoutingModule
  ],
  declarations: [AnswerModalPage]
})
export class AnswerModalPageModule {}
