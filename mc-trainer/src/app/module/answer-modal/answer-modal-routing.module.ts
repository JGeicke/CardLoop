import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnswerModalPage } from './answer-modal.page';

const routes: Routes = [
  {
    path: '',
    component: AnswerModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnswerModalPageRoutingModule {}
