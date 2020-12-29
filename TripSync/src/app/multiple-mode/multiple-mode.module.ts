import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MultipleModePageRoutingModule } from './multiple-mode-routing.module';

import { MultipleModePage } from './multiple-mode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MultipleModePageRoutingModule
  ],
  declarations: [MultipleModePage]
})
export class MultipleModePageModule {}
