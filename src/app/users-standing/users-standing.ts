import {AfterViewInit, ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {filter, map, switchMap, withLatestFrom} from 'rxjs/operators'; 
import {DRIVER_IN_LIST_PTS, DRIVER_PLACE_PTS} from '../common';
import {Language} from '../enums';
import * as fullResultsSelectors from '../full-results/store/full-results.selectors';
import {ToolbarActionType} from '../toolbar/store/toolbar.actions';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';
import {PlayerRoundResult, User, UserPoints} from '../types';


@Component({
  selector: 'users-standing',
  templateUrl: './users-standing.html',
  styleUrls: ['./users-standing.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersStandingComponent implements AfterViewInit {
  readonly columns = ['place', 'name', 'points'];
  readonly Language = Language;

  readonly language = this.store.select(toolbarSelectors.selectLanguage);
  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly isLockedLayout = this.store.select(toolbarSelectors.selectIsLockedLayout);
  readonly users = this.store.select(fullResultsSelectors.selectUsers);
  readonly currentUser = this.store.select(toolbarSelectors.selectCurrentUser);
  private readonly isLoaded = this.store.select(toolbarSelectors.selectIsLoaded);
  private readonly playersYearResults = this.store.select(toolbarSelectors.selectPlayersResults);
  
  readonly sortedPlayersYearPoints = this.isLoaded.pipe(
    filter(isLoaded => !!isLoaded),
    switchMap(() => this.playersYearResults),
    withLatestFrom(this.users),
    map(([results, users]) => toPoints(results, users)),
  );

  constructor(private readonly store: Store) {}

  ngAfterViewInit(): void {
    this.store.dispatch({type: ToolbarActionType.LOAD_PLAYERS_RESULTS});
  }
}

function toPoints(results: PlayerRoundResult[], users: User[]): UserPoints[] {
  return users.reduce((acc, user) => {
    const points = results.reduce((sum, result) => {
      if (result.userid === user.id) {
        const increment = DRIVER_IN_LIST_PTS * (result.qual_guessed_on_list.length + result.race_guessed_on_list.length) + 
          DRIVER_PLACE_PTS * (result.qual_guessed_position.length + result.race_guessed_position.length);
        sum += increment;
      }
      return sum;
    }, 0);
    acc.push({user, points});
    return acc;
  }, [] as UserPoints[]).sort((left, right) => right.points - left.points);
}
