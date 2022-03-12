import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PointsComponent} from './points.component';


@NgModule({
  imports: [CommonModule],
  declarations: [PointsComponent],
  exports: [PointsComponent],
})
export class PointsModule {}
