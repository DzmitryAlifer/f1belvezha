import {ChangeDetectionStrategy, Component} from '@angular/core';


@Component({
  selector: 'app-drivers-standing',
  templateUrl: './drivers-standing.component.html',
  styleUrls: ['./drivers-standing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriversStandingComponent {

  constructor() {}
}
