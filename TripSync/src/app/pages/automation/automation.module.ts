import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AutomationPageRoutingModule } from './automation-routing.module';

import { AutomationPage } from './automation.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,

    AutomationPageRoutingModule
  ],
  declarations: [AutomationPage]
})
export class AutomationPageModule {}
