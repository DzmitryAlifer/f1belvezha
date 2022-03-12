import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoinModule} from '../coin/coin.module';
import {PointsComponent} from './points.component';


@NgModule({
  imports: [CoinModule, CommonModule],
  declarations: [PointsComponent],
  exports: [PointsComponent],
})
export class PointsModule {}
