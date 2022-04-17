import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Prediction, Race} from '../types';


@Component({
  selector: 'result-details',
  templateUrl: './result-details.html',
  styleUrls: ['./result-details.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultDetailsComponent {
  @Input() playerPrediction: Prediction|undefined;
  @Input() result: Race|undefined;

  constructor() {}
}
