import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScenesPage } from './scenes.page';

const routes: Routes = [
  {
    path: '',
    component: ScenesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScenesPageRoutingModule {}
