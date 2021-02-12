import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MultipleModePage } from './multiple-mode.page';

const routes: Routes = [
  {
    path: '',
    component: MultipleModePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultipleModePageRoutingModule {}
