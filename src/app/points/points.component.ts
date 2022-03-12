import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {DRIVER_IN_LIST_PTS, DRIVER_PLACE_PTS} from '../common';


@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointsComponent {
  @Input() points = [[0, 0], [0, 0]];

  readonly DRIVER_IN_LIST_PTS = DRIVER_IN_LIST_PTS;
  readonly DRIVER_PLACE_PTS = DRIVER_PLACE_PTS;

  readonly total = DRIVER_IN_LIST_PTS * this.points[0][0] + 
    DRIVER_PLACE_PTS * this.points[0][1] + 
    DRIVER_IN_LIST_PTS * this.points[1][0] +
    DRIVER_PLACE_PTS * this.points[1][1];

  constructor() {}
}
