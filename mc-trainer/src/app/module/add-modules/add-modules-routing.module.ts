import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddModulesPage } from './add-modules.page';

const routes: Routes = [
  {
    path: '',
    component: AddModulesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddModulesPageRoutingModule {}
