import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators'; 
import * as fullResultsSelectors from '../full-results/store/full-results.selectors';


@Component({
  selector: 'users-standing',
  templateUrl: './users-standing.html',
  styleUrls: ['./users-standing.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersStandingComponent {
  readonly columns = ['place', 'name', 'points'];
  readonly users = this.store.select(fullResultsSelectors.selectUsers).pipe(
    map(users => [...users].sort((left, right) => (left.seasonpoints > right.seasonpoints) ? -1 : 1)));

  constructor(private readonly store: Store) {}
}
