import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutomationPage } from './automation.page';

const routes: Routes = [
  {
    path: '',
    component: AutomationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutomationPageRoutingModule {}
