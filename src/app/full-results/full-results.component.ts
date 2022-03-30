import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator, MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import {Store} from '@ngrx/store';
import {combineLatest, merge, ReplaySubject} from 'rxjs';
import {filter, debounceTime, map, shareReplay} from 'rxjs/operators';
import {PredictionDialog} from '../prediction-dialog/prediction-dialog';
import {Prediction, Race, User} from '../types';
import * as fullResultsSelectors from './store/full-results.selectors';
import {FullResultsActionType} from './store/full-results.actions';
import {EventType} from '../toolbar/next-event/next-event.component';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';
import {formatDate, getCircuitPath, getFlagLink, getIndexes, getNextEvent} from '../common';
import {LocalStorageService} from '../service/local-storage.service';


const PAGE_SIZE = 5;
const PAGE_SIZES = [5, 7, 10];

    
@Component({
  selector: 'full-results',
  templateUrl: './full-results.component.html',
  styleUrls: ['./full-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullResultsComponent implements OnInit, AfterViewInit {
  readonly PAGE_SIZE = PAGE_SIZE;
  readonly PAGE_SIZES = PAGE_SIZES;
  readonly EventType = EventType;

  readonly pageSize = new ReplaySubject<number>(1);
  private readonly pageEventSubject = new ReplaySubject<PageEvent>(1);

  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly users = this.store.select(fullResultsSelectors.selectUsers);
  readonly currentUser = this.store.select(toolbarSelectors.selectCurrentUser);
  readonly allPredictions = this.store.select(fullResultsSelectors.selectAllPredictions);
  readonly currentUserPredictions = combineLatest([this.currentUser, this.allPredictions]).pipe(
    map(([currentUser, allPredictions]) => allPredictions.filter(prediction => prediction.userid == currentUser?.id)));

  readonly races = this.store.select(fullResultsSelectors.selectRaces).pipe(shareReplay(1));
  readonly nextEvent = getNextEvent();
  readonly nextRaceRound = this.nextEvent.pipe(map(nextEvent => nextEvent.round));
  readonly isLoaded = combineLatest([this.users, this.races]).pipe(map(([users, races]) => !!races && !!users));

  readonly nextRacePredictions = combineLatest([this.allPredictions, this.nextRaceRound]).pipe(
    debounceTime(0),
    map(([allPredictions, nextRaceRound]) => allPredictions.filter(prediction => prediction.round === nextRaceRound)));

  readonly currentUserHasPrediction = combineLatest([this.currentUserPredictions, this.nextRaceRound]).pipe(
    map(([currentUserPredictions, round]) => (currentUserPredictions ?? []).some((prediction: Prediction) =>
        prediction.round === round &&
        (prediction.qualification.filter(name => !!name).length || prediction.race.filter(name => !!name).length),
      )),
  );

  private readonly initialPageEvent = combineLatest([this.users, this.currentUser, this.pageSize]).pipe(
    debounceTime(0),
    filter(([users]) => !!users.length),
    map(([users, currentUser, pageSize]) => {
      return {
        pageIndex: Math.floor(users.findIndex(user => user.id == currentUser?.id) / pageSize),
        pageSize,
      } as PageEvent;
    }),
  );

  readonly pageEvent = merge(this.initialPageEvent, this.pageEventSubject);

  readonly displayedColumns = combineLatest([this.users, this.pageEvent]).pipe(
    debounceTime(0),
    map(([users, pageEvent]) => {
      const startIndex = pageEvent.pageIndex !== -1 ? pageEvent.pageIndex * pageEvent.pageSize : 0;
      const columns = users.slice(startIndex, startIndex + pageEvent.pageSize).map(user => 'user' + user.id);
      const trailingColumnsCount = pageEvent.pageSize - columns.length;

      for (let i = 0; i < trailingColumnsCount; i++) {
        columns.push('empty' + i);
      }

      return columns;
    }),
    map(userColumns => ['event', ...userColumns]),
  );

  readonly points = this.store.select(fullResultsSelectors.selectCurrentYearPoints);

  constructor(
    private readonly matPaginatorIntl: MatPaginatorIntl,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly localStorageService: LocalStorageService,
    private readonly predictionDialog: MatDialog,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    const pageSize = this.localStorageService.getItem<number>('pageSize') ?? PAGE_SIZES[0];
    this.pageSize.next(pageSize);

    this.currentUserHasPrediction.subscribe();
    this.store.dispatch({type: FullResultsActionType.LOAD_RACES});
    this.store.dispatch({type: FullResultsActionType.LOAD_USERS});
    this.store.dispatch({type: FullResultsActionType.LOAD_NEXT_RACE_TEAM_VS_TEAM_PROPOSALS});
    this.store.dispatch({type: FullResultsActionType.LOAD_ALL_PREDICTIONS});
    this.store.dispatch({type: FullResultsActionType.LOAD_CURRENT_YEAR_RESULTS});
    this.store.dispatch({type: FullResultsActionType.CALCULATE_CURRENT_YEAR_POINTS});
  }

  ngAfterViewInit(): void {
    this.matPaginatorIntl.itemsPerPageLabel = 'Players per page';
  }

  onPageChange(pageEvent: PageEvent): void {
    this.localStorageService.setItem('pageSize', pageEvent.pageSize);
    this.pageSize.next(pageEvent.pageSize);
    this.pageEventSubject.next(pageEvent);
  }

  formatDate(dateStr: string): string {
    return formatDate(dateStr);
  }

  getFlagLink(countryName: string): string {
    return getFlagLink(countryName);
  }

  getCircuitPath(countryName: string): string {
    return getCircuitPath(countryName);
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

  getTrailingIndexes(users: User[]|null, pageSize: number): number[] {
    if (!users?.length) {
      return [];
    }

    const trailingColumnsCount = pageSize - users.length % pageSize;

    return getIndexes(trailingColumnsCount);
  }
}
