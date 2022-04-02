import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import {getNextEvent} from '../common';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly currentUser = this.store.select(toolbarSelectors.selectCurrentUser);
  readonly nextEvent = getNextEvent();
  readonly nextRaceRound = this.nextEvent.pipe(map(nextEvent => nextEvent.round));
  
  constructor(
    private readonly store: Store,
  ) {}
}
