import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedInPage } from './logged-in.page';

const routes: Routes = [
  {
    path: '',
    component: LoggedInPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoggedInPageRoutingModule {}
