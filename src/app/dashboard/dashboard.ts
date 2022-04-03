import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {USER_DIALOG_OPTIONS} from 'src/constants';
import {Page} from '../enums'; 
import {DRIVER_IN_LIST_PTS, DRIVER_PLACE_PTS, formatDate, getFlagLink, getFullUserName, getNextEvent, getSeasonPointsPerRound} from '../common';
import {FullResultsActionType} from '../full-results/store/full-results.actions'; 
import * as fullResultsSelectors from '../full-results/store/full-results.selectors';
import {ChartService} from '../service/chart.service';
import {NewsService} from '../service/news.service';
import {CreateAccountDialog} from '../toolbar/create-account-dialog/create-account-dialog';
import {LoginDialog} from '../toolbar/login-dialog/login-dialog';
import {ToolbarActionType} from '../toolbar/store/toolbar.actions';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';
import {User} from '../types';


const DASHBOARD_NEWS_NUMBER = 6;
const PAST_RACES_SHOWN_NUMBER = 2;
const FUTURE_RACES_SHOWN_NUMBER = 3;


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  readonly DRIVER_IN_LIST_PTS = DRIVER_IN_LIST_PTS;
  readonly DRIVER_PLACE_PTS = DRIVER_PLACE_PTS;
  readonly Page = Page;
  readonly columns = ['place', 'name', 'seasonPoints'];

  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly currentUser = this.store.select(toolbarSelectors.selectCurrentUser);
  readonly users = this.store.select(fullResultsSelectors.selectUsers);
  
  readonly lastRegisteredUserFullName = this.users.pipe(
    map(users => {
      const userMaxId = Math.max.apply(Math, users.map((user) => user.id!));
      const lastUser = users.find(user => user.id === userMaxId);
      return getFullUserName(lastUser);
    }));

  readonly nextEvent = getNextEvent();
  readonly newsList = this.newsService.getNewsEn().pipe(map(news => news.slice(0, DASHBOARD_NEWS_NUMBER)));
  private readonly races = this.store.select(toolbarSelectors.selectCalendar);
  readonly nextRaceRound = this.nextEvent.pipe(map(nextEvent => nextEvent.round));
  
  readonly visibleRaces = combineLatest([this.races, this.nextRaceRound]).pipe(
    map(([races, nextRaceRound]) => {
      const nextRaceIndex = nextRaceRound - 1;
      const startIndex = Math.max(nextRaceIndex - PAST_RACES_SHOWN_NUMBER, 0);
      const endIndex = Math.min(nextRaceIndex + FUTURE_RACES_SHOWN_NUMBER + 1, races.length - 1);
      return races.slice(startIndex, endIndex);
    }),
  );
  
  readonly mostSelectableDriversChart = this.chartService.getMostSelectableDrivers();

  constructor(
    private readonly chartService: ChartService,
    private readonly createAccountDialog: MatDialog,
    private readonly loginDialog: MatDialog,
    private readonly newsService: NewsService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.store.dispatch({type: FullResultsActionType.LOAD_ALL_PREDICTIONS});
    this.store.dispatch({type: FullResultsActionType.LOAD_CURRENT_YEAR_RESULTS});
  }

  showPage(page: Page): void {
    setTimeout(() => {
      this.store.dispatch({type: ToolbarActionType.SHOW_PAGE, payload: {page}});
    }, 100);
  }
  
  formatDate(dateStr: string): string {
    return formatDate(dateStr);
  }

  createAccount(): void {
    this.createAccountDialog.open(CreateAccountDialog, USER_DIALOG_OPTIONS);
  }

  getFlagLink(countryName: string): string {
    return getFlagLink(countryName);
  }

  getCircuitPath(countryName: string): string {
    return this.getCircuitPath(countryName);
  }

  getFullUserName(user: User): string {
    return getFullUserName(user);
  }

  login(): void {
    this.loginDialog.open(LoginDialog, USER_DIALOG_OPTIONS);
  }

  getSeasonPointsPerRound(user: User): number {
    return getSeasonPointsPerRound(user);
  }
}
