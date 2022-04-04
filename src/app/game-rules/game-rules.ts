import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CORRECT_TEAM_FROM_PAIR_PTS, DRIVER_IN_LIST_PTS, DRIVER_PLACE_PTS, WRONG_TEAM_PTS} from '../common';


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
}
