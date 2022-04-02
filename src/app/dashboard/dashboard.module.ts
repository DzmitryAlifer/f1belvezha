import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {DashboardComponent} from './dashboard';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
  ],
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
})
export class DashboardModule {}
