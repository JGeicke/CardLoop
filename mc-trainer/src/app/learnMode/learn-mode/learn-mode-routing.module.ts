import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LearnModePage } from './learn-mode.page';

const routes: Routes = [
  {
    path: '',
    component: LearnModePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LearnModePageRoutingModule {}
