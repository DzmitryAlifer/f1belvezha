import {AfterViewInit, ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {filter, map, switchMap, withLatestFrom} from 'rxjs/operators'; 
import {toPoints} from '../common';
import {Language} from '../enums';
import * as fullResultsSelectors from '../full-results/store/full-results.selectors';
import {ToolbarActionType} from '../toolbar/store/toolbar.actions';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';


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

  constructor(private readonly store: Store) {}

  ngAfterViewInit(): void {
    this.store.dispatch({type: ToolbarActionType.LOAD_PLAYERS_RESULTS});
  }
}
