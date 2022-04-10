import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import {CORRECT_TEAM_FROM_PAIR_PTS, DRIVER_IN_LIST_PTS, DRIVER_PLACE_PTS, WRONG_TEAM_PTS} from '../common';
import {CORRECT_TEAM_FROM_PAIR_COLOR, DRIVER_IN_LIST_COLOR, DRIVER_CORRECT_PLACE_COLOR, WRONG_TEAM_COLOR} from '../../constants';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';


@Component({
  selector: 'points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointsComponent {
  @Input() points: Array<number[]|null> = [null, null, null];
  @Input() isCurrentUser = false;

  readonly DRIVER_IN_LIST_PTS = DRIVER_IN_LIST_PTS;
  readonly DRIVER_PLACE_PTS = DRIVER_PLACE_PTS;
  readonly CORRECT_TEAM_FROM_PAIR_PTS = CORRECT_TEAM_FROM_PAIR_PTS;
  readonly WRONG_TEAM_PTS = WRONG_TEAM_PTS;

  readonly DRIVER_IN_LIST_COLOR = DRIVER_IN_LIST_COLOR;
  readonly DRIVER_CORRECT_PLACE_COLOR = DRIVER_CORRECT_PLACE_COLOR;
  readonly CORRECT_TEAM_FROM_PAIR_COLOR = CORRECT_TEAM_FROM_PAIR_COLOR;
  readonly WRONG_TEAM_COLOR = WRONG_TEAM_COLOR;

  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);

  constructor(private readonly store: Store) {}

  getTotalPoints(): number {
    const qualifyingPredictionPoints = 
        this.points[0] ? DRIVER_IN_LIST_PTS * this.points[0][0] + DRIVER_PLACE_PTS * this.points[0][1] : 0;
    const racePredictionPoints = 
      this.points[1] ? DRIVER_IN_LIST_PTS * this.points[1][0] + DRIVER_PLACE_PTS * this.points[1][1] : 0;
    const correctTeamVsTeamPoints = this.points[2] ? (CORRECT_TEAM_FROM_PAIR_PTS * (this.points[2][0] ?? 0)) : 0;
    const wrongTeamVsTeamPoints = this.points[2] ? (WRONG_TEAM_PTS * (this.points[2][1] ?? 0)) : 0;

    return qualifyingPredictionPoints + racePredictionPoints + correctTeamVsTeamPoints + wrongTeamVsTeamPoints;
  }
}
