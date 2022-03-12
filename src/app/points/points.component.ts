import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointsComponent {

  constructor() {}

}
