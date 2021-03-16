import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddTimePageRoutingModule } from './add-time-routing.module';

import { AddTimePage } from './add-time.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddTimePageRoutingModule
  ],
  declarations: [AddTimePage]
})
export class AddTimePageModule {}
