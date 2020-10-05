import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AboutpagePage} from './aboutpage.page';

const routes: Routes = [
    {
        path: '',
        component: AboutpagePage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AboutpagePageRoutingModule {
}
