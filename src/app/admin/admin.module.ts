import {NgModule} from '@angular/core';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button'; 
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {DriverPlacesModule} from '../driver-places/driver-places.module';
import {AdminComponent} from './admin';


@NgModule({
  imports: [
    CdkAccordionModule,
    CommonModule,
    DriverPlacesModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
  ],
  declarations: [AdminComponent],
  exports: [AdminComponent],
})
export class AdminModule {}
