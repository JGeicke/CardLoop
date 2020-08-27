import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleDetailPage } from './module-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ModuleDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuleDetailPageRoutingModule {}
