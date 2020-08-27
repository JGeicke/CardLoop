import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleListPage } from './module-list.page';

const routes: Routes = [
  {
    path: '',
    component: ModuleListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModuleListPageRoutingModule {}
