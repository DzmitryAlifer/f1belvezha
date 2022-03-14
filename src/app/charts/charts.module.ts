import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {ChartsComponent} from './charts';
import {NgxEchartsModule} from 'ngx-echarts';


@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    NgxEchartsModule.forRoot({echarts: () => import('echarts')}),
  ],
  declarations: [ChartsComponent],
  exports: [ChartsComponent],
})
export class ChartsModule {}
