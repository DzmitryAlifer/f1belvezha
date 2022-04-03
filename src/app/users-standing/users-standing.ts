import {AfterViewInit, ChangeDetectionStrategy, Component} from '@angular/core';
import {Sort} from '@angular/material/sort';
import {Store} from '@ngrx/store';
import {merge, ReplaySubject} from 'rxjs';
import {compare, getFullUserName, getSeasonPointsPerRound} from '../common';
import {Language} from '../enums';
import * as fullResultsSelectors from '../full-results/store/full-results.selectors';
import {ToolbarActionType} from '../toolbar/store/toolbar.actions';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';
import {User} from '../types';


@Component({
  selector: 'users-standing',
  templateUrl: './users-standing.html',
  styleUrls: ['./users-standing.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersStandingComponent implements AfterViewInit {
  readonly columns = ['place', 'name', 'seasonPoints', 'seasonEventsTotal'];
  readonly Language = Language;

  private readonly sortedUsers = new ReplaySubject<User[]>(1);

  readonly language = this.store.select(toolbarSelectors.selectLanguage);
  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly isLockedLayout = this.store.select(toolbarSelectors.selectIsLockedLayout);
  private readonly initialUsers = this.store.select(fullResultsSelectors.selectUsers);
  readonly currentUser = this.store.select(toolbarSelectors.selectCurrentUser);

  readonly users = merge(this.initialUsers, this.sortedUsers);

  constructor(private readonly store: Store) {}

  ngAfterViewInit(): void {
    this.store.dispatch({type: ToolbarActionType.LOAD_PLAYERS_RESULTS});
  }

  sortPlayers(sort: Sort, users: User[]|null) {
    if (!users || !sort.active || !sort.direction) {
      return;
    }

    const isAsc = sort.direction === 'asc';

    const sortedUsers = users.slice().sort((left, right) => {
      switch (sort.active) {
        case 'seasonPoints':
          return compare(left.seasonpoints, right.seasonpoints, isAsc);
        case 'seasonEventsTotal':
          return compare(getSeasonPointsPerRound(left), getSeasonPointsPerRound(right), isAsc);
        default:
          return 0;
      }
    });

    this.sortedUsers.next(sortedUsers);
  }

  getFullUserName(user: User): string {
    return getFullUserName(user);
  }

  getSeasonPointsPerRound(user: User): number {
    return getSeasonPointsPerRound(user);
  }
}
