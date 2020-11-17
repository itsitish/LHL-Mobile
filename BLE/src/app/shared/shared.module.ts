import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyValuePipe } from './pipes/empty-value.pipe';
import { ColorPickerModule } from 'ngx-color-picker';



@NgModule({
  declarations: [EmptyValuePipe],
  imports: [
    CommonModule
  ],
  exports: [EmptyValuePipe,ColorPickerModule]
})
export class SharedModule { }
