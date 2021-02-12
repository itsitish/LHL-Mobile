import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScenesPageRoutingModule } from './scenes-routing.module';

import { ScenesPage } from './scenes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScenesPageRoutingModule
  ],
  declarations: [ScenesPage]
})
export class ScenesPageModule {}
