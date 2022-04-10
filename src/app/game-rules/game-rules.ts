import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CORRECT_TEAM_FROM_PAIR_PTS, DRIVER_IN_LIST_PTS, DRIVER_PLACE_PTS, WRONG_TEAM_PTS} from '../common';
import {CORRECT_TEAM_FROM_PAIR_COLOR, DRIVER_IN_LIST_COLOR, DRIVER_CORRECT_PLACE_COLOR, WRONG_TEAM_COLOR} from '../../constants';


@Component({
  selector: 'game-rules',
  templateUrl: './game-rules.html',
  styleUrls: ['./game-rules.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameRulesComponent {
  readonly DRIVER_IN_LIST_PTS = DRIVER_IN_LIST_PTS;
  readonly DRIVER_PLACE_PTS = DRIVER_PLACE_PTS;
  readonly CORRECT_TEAM_FROM_PAIR_PTS = CORRECT_TEAM_FROM_PAIR_PTS;
  readonly WRONG_TEAM_PTS = WRONG_TEAM_PTS

  readonly DRIVER_IN_LIST_COLOR = DRIVER_IN_LIST_COLOR;
  readonly DRIVER_CORRECT_PLACE_COLOR = DRIVER_CORRECT_PLACE_COLOR;
  readonly CORRECT_TEAM_FROM_PAIR_COLOR = CORRECT_TEAM_FROM_PAIR_COLOR;
  readonly WRONG_TEAM_COLOR = WRONG_TEAM_COLOR;
}
