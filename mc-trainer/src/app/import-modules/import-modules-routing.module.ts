import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImportModulesPage } from './import-modules.page';

const routes: Routes = [
  {
    path: '',
    component: ImportModulesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImportModulesPageRoutingModule {}
