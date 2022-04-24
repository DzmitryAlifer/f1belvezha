import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {DriversStandingComponent} from './drivers-standing';


@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
  ],
  declarations: [DriversStandingComponent],
  exports: [DriversStandingComponent],
})
export class DriversStandingModule {}
