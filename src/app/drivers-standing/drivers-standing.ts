import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store'; 
import {getBolidPath} from '../common';
import {F1PublicApiService} from '../service/f1-public-api.service';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';


@Component({
  selector: 'drivers-standing',
  templateUrl: './drivers-standing.html',
  styleUrls: ['./drivers-standing.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriversStandingComponent {
  readonly columns = ['place', 'name', 'points'];

  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly isLockedLayout = this.store.select(toolbarSelectors.selectIsLockedLayout);
  readonly driverStandings = this.f1PublicApiService.getDriverStandings();

  constructor(
    private readonly f1PublicApiService: F1PublicApiService,
    private readonly store: Store,
  ) {}

  getBolidPath(driverFamilyName: string): string {
    return getBolidPath(driverFamilyName);
  }
}
