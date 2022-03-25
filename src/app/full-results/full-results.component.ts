import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';
import {Store} from '@ngrx/store';
import {combineLatest, merge, ReplaySubject} from 'rxjs';
import {filter, debounceTime, map, shareReplay} from 'rxjs/operators';
import {PredictionDialog} from '../prediction-dialog/prediction-dialog';
import {Prediction, Race, User} from '../types';
import * as moment from 'moment';
import * as fullResultsSelectors from './store/full-results.selectors';
import {FullResultsActionType} from './store/full-results.actions';
import {EventType} from '../toolbar/next-event/next-event.component';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';
import {getFlagLink, getIndexes, getNextEvent} from '../common';


const NOW = moment();
const ROUND_TO_INDEX_OFFSET = 2;
const PAGE_SIZE = 5;

    
@Component({
  selector: 'full-results',
  templateUrl: './full-results.component.html',
  styleUrls: ['./full-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullResultsComponent implements OnInit {
  readonly PAGE_SIZE = PAGE_SIZE;
  readonly EventType = EventType;

  private readonly pageEventSubject = new ReplaySubject<PageEvent>(1);

  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly users = this.store.select(fullResultsSelectors.selectUsers);
  readonly currentUser = this.store.select(toolbarSelectors.selectCurrentUser);
  readonly allPredictions = this.store.select(fullResultsSelectors.selectAllPredictions);
  readonly currentUserPredictions = combineLatest([this.currentUser, this.allPredictions]).pipe(
    map(([currentUser, allPredictions]) => allPredictions.filter(prediction => prediction.userid == currentUser?.id)));

  readonly races = this.store.select(fullResultsSelectors.selectRaces).pipe(shareReplay(1));
  readonly nextRaceRound = this.races.pipe(map(races => races.findIndex(nextRacePredicate) + ROUND_TO_INDEX_OFFSET));
  readonly nextEvent = getNextEvent();
  readonly isLoaded = combineLatest([this.users, this.races]).pipe(map(([users, races]) => !!races && !!users));

  readonly nextRacePredictions = combineLatest([this.allPredictions, this.nextRaceRound]).pipe(
    debounceTime(0),
    map(([allPredictions, nextRaceRound]) => allPredictions.filter(prediction => prediction.round === nextRaceRound)));

  readonly currentUserHasPrediction = combineLatest([this.currentUserPredictions, this.nextRaceRound]).pipe(
    map(([currentUserPredictions, round]) => (currentUserPredictions ?? []).some((prediction: Prediction) =>
        prediction.round === round &&
        prediction.qualification.filter(name => !!name).length &&
        prediction.race.filter(name => !!name).length,
      )),
  );

  private readonly initialPageEvent = combineLatest([this.users, this.currentUser]).pipe(
    debounceTime(0),
    filter(([users]) => !!users.length),
    map(([users, currentUser]) => Math.floor(users.findIndex(user => user.id == currentUser?.id) / PAGE_SIZE)),
    map(currentUserPageIndex => ({pageIndex: currentUserPageIndex, pageSize: PAGE_SIZE}) as PageEvent),
  );

  readonly pageEvent = merge(this.initialPageEvent, this.pageEventSubject);

  readonly displayedColumns = combineLatest([this.users, this.pageEvent]).pipe(
    debounceTime(0),
    map(([users, pageEvent]) => {
      const startIndex = pageEvent.pageIndex !== -1 ? pageEvent.pageIndex * pageEvent.pageSize : 0;
      const columns = users.slice(startIndex, startIndex + PAGE_SIZE).map(user => 'user' + user.id);
      const trailingColumnsCount = PAGE_SIZE - columns.length;

      for (let i = 0; i < trailingColumnsCount; i++) {
        columns.push('empty' + i);
      }

      return columns;
    }),
    map(userColumns => ['event', ...userColumns, 'empty', 'stats']),
  );

  readonly points = this.store.select(fullResultsSelectors.selectCurrentYearPoints);

  constructor(
    private readonly predictionDialog: MatDialog,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.currentUserHasPrediction.subscribe();
    this.store.dispatch({type: FullResultsActionType.LOAD_RACES});
    this.store.dispatch({type: FullResultsActionType.LOAD_USERS});
    this.store.dispatch({type: FullResultsActionType.LOAD_ALL_PREDICTIONS});
    this.store.dispatch({type: FullResultsActionType.LOAD_CURRENT_YEAR_RESULTS});
    this.store.dispatch({type: FullResultsActionType.CALCULATE_CURRENT_YEAR_POINTS});
  }

  onPageChange(pageEvent: PageEvent): void {
    this.pageEventSubject.next(pageEvent);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const month = new Intl.DateTimeFormat('en', {month: 'short'}).format(date);
    const day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date);

    return `${month} ${day}`;
  }

  getFlagLink(countryName: string): string {
    return getFlagLink(countryName);
  }

  getCircuitPath(countryName: string): string {
    return `/assets/images/circuits/${countryName}.png`;
  }

  getPoints(points: Map<number, Map<number, number[][]>>, user: User, race: Race): Array<number[]|null> {
    return points.get(user.id!)?.get(race.round) ?? [null, null];
  }

  openPredictionDialog(userId: number, round: number, hasPrediction: boolean, isQualificationLocked: boolean, isRaceLocked: boolean): void {
    this.predictionDialog.open(PredictionDialog, {
      disableClose: true,
      data: {userId, round, hasPrediction, isQualificationLocked, isRaceLocked},
    });
  }

  hasPrediction(user: User, nextRacePredictions: Prediction[] | null): boolean {
    return (nextRacePredictions ?? []).some(prediction => prediction.userid == user.id);
  }

  getTrailingIndexes(users: User[]|null): number[] {
    if (!users?.length) {
      return [];
    }

    const trailingColumnsCount = PAGE_SIZE - users.length % PAGE_SIZE;

    return getIndexes(trailingColumnsCount);
  }
}

function nextRacePredicate(race: Race, index: number, races: Race[]): boolean {
  return NOW.isAfter(race.date) && NOW.isBefore(races[index + 1].date);
}
