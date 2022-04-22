import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {DRIVER_TEAM_MAPPING} from 'src/constants';
import {NOT_SELECTED_DRIVER_NAME} from '../common';


@Component({
  selector: 'driver-bolid',
  templateUrl: './driver-bolid.html',
  styleUrls: ['./driver-bolid.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverBolidComponent {
  @Input() driverFamilyName = NOT_SELECTED_DRIVER_NAME;

  readonly NOT_SELECTED_DRIVER_NAME = NOT_SELECTED_DRIVER_NAME;

  getBolidPath(driverFamilyName: string): string {
    const teamId = DRIVER_TEAM_MAPPING.get(driverFamilyName);
    return `/assets/images/bolids/${teamId}.png`;
  }
}
