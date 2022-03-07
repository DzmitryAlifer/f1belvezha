import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {DriversStandingComponent} from './drivers-standing.component';


@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
  ],
  declarations: [DriversStandingComponent],
  exports: [DriversStandingComponent],
})
export class DriversStandingModule {}
