import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators'; 
import * as fullResultsSelectors from '../full-results/store/full-results.selectors';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';


@Component({
  selector: 'users-standing',
  templateUrl: './users-standing.html',
  styleUrls: ['./users-standing.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersStandingComponent {
  readonly columns = ['place', 'name', 'points'];

  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly isLockedLayout = this.store.select(toolbarSelectors.selectIsLockedLayout);
  readonly users = this.store.select(fullResultsSelectors.selectUsers).pipe(
    map(users => [...users].sort((left, right) => (left.seasonpoints > right.seasonpoints) ? -1 : 1)));
  readonly currentUser = this.store.select(toolbarSelectors.selectCurrentUser);

  constructor(private readonly store: Store) {}
}
