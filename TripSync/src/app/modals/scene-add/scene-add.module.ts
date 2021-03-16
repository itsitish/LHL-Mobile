import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SceneAddPageRoutingModule } from './scene-add-routing.module';

import { SceneAddPage } from './scene-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SceneAddPageRoutingModule
  ],
  declarations: [SceneAddPage]
})
export class SceneAddPageModule {}
