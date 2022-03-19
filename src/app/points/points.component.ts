import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import {DRIVER_IN_LIST_PTS, DRIVER_PLACE_PTS} from '../common';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';


@Component({
  selector: 'points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointsComponent {
  @Input() points = [[0, 0], [0, 0]];
  @Input() isCurrentUser = false;

  readonly DRIVER_IN_LIST_PTS = DRIVER_IN_LIST_PTS;
  readonly DRIVER_PLACE_PTS = DRIVER_PLACE_PTS;

  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);

  constructor(private readonly store: Store) {}

  getTotalPoints(): number {
    const qualifyingPredictionPoints = 
        this.points[0] ? DRIVER_IN_LIST_PTS * this.points[0][0] + DRIVER_PLACE_PTS * this.points[0][1] : 0;
    const racePredictionPoints = 
      this.points[1] ? DRIVER_IN_LIST_PTS * this.points[1][0] + DRIVER_PLACE_PTS * this.points[1][1] : 0;

    return qualifyingPredictionPoints + racePredictionPoints;
  }
}
