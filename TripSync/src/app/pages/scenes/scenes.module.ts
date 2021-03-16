import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScenesPageRoutingModule } from './scenes-routing.module';

import { ScenesPage } from './scenes.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,

    FormsModule,
    IonicModule,
    ScenesPageRoutingModule
  ],
  declarations: [ScenesPage]
})
export class ScenesPageModule {}
