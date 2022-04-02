import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DRIVER_IN_LIST_PTS, DRIVER_PLACE_PTS} from '../common';


@Component({
  selector: 'game-rules',
  templateUrl: './game-rules.html',
  styleUrls: ['./game-rules.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameRulesComponent {
  readonly DRIVER_IN_LIST_PTS = DRIVER_IN_LIST_PTS;
  readonly DRIVER_PLACE_PTS = DRIVER_PLACE_PTS;
}
