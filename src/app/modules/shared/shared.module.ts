import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import{ AntdesignModule } from '../antdesign/antdesign.module';



@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    AntdesignModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class SharedModule { }
