import {ChangeDetectionStrategy, Component, Input} from '@angular/core';


@Component({
  selector: 'result-details',
  templateUrl: './result-details.html',
  styleUrls: ['./result-details.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultDetailsComponent {

  constructor() {}
}
