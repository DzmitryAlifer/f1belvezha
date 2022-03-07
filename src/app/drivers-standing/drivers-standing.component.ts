import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store'; 
import {F1PublicApiService} from '../service/f1-public-api.service';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';


@Component({
  selector: 'drivers-standing',
  templateUrl: './drivers-standing.component.html',
  styleUrls: ['./drivers-standing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriversStandingComponent {
  readonly columns = ['place', 'name', 'points'];

  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly driverStandings = this.f1PublicApiService.getDriverStandings();

  constructor(
    private readonly f1PublicApiService: F1PublicApiService,
    private readonly store: Store,
  ) {}
}
