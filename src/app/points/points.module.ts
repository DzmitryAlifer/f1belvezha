import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CoinModule} from '../coin/coin.module';
import {PointsComponent} from './points.component';


@NgModule({
  imports: [CoinModule, CommonModule, MatTooltipModule],
  declarations: [PointsComponent],
  exports: [PointsComponent],
})
export class PointsModule {}
