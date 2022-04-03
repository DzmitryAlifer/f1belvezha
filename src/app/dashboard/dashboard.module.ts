import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {RouterModule} from '@angular/router';
import {NgxEchartsModule} from 'ngx-echarts';
import {CoinModule} from '../coin/coin.module';
import {DashboardComponent} from './dashboard';


@NgModule({
  imports: [
    CoinModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    RouterModule,
    NgxEchartsModule.forRoot({echarts: () => import('echarts')}),
  ],
  declarations: [DashboardComponent],
  exports: [DashboardComponent],
})
export class DashboardModule {}
