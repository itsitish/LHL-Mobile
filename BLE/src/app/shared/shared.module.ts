import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyValuePipe } from './pipes/empty-value.pipe';
import { ColorPickerModule } from 'ngx-color-picker';
import { FavouritesComponent } from './components/favourites/favourites.component'


@NgModule({
  declarations: [EmptyValuePipe, FavouritesComponent],
  imports: [
    CommonModule
  ],
  exports: [EmptyValuePipe, ColorPickerModule, FavouritesComponent]
})
export class SharedModule { }
