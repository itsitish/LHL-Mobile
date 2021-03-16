import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyValuePipe } from './pipes/empty-value.pipe';
import { FavouritesComponent } from './components/favourites/favourites.component'
import { HeaderComponent } from './components/header/header.component';


@NgModule({
  declarations: [EmptyValuePipe, FavouritesComponent,HeaderComponent],
  imports: [
    CommonModule
  ],
  exports: [EmptyValuePipe, FavouritesComponent,HeaderComponent]
})
export class SharedModule { }
