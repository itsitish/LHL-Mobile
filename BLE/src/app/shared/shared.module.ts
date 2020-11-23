import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyValuePipe } from './pipes/empty-value.pipe';
import { FavouritesComponent } from './components/favourites/favourites.component'


@NgModule({
  declarations: [EmptyValuePipe, FavouritesComponent],
  imports: [
    CommonModule
  ],
  exports: [EmptyValuePipe, FavouritesComponent]
})
export class SharedModule { }
