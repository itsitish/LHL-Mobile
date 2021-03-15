import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTimePage } from './add-time.page';

const routes: Routes = [
  {
    path: '',
    component: AddTimePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTimePageRoutingModule {}
