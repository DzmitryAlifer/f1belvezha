import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {PredictionDialog} from '../prediction-dialog/prediction-dialog';
import {Prediction, Race, User} from '../types';
import * as moment from 'moment';
import * as fullResultsSelectors from './store/full-results.selectors';
import {FullResultsActionType} from './store/full-results.actions';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';
import { getFlagLink } from './common';


const NOW = moment();
const ROUND_TO_INDEX_OFFSET = 2;

    
@Component({
  selector: 'full-results',
  templateUrl: './full-results.component.html',
  styleUrls: ['./full-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullResultsComponent implements OnInit {
  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly users = this.store.select(fullResultsSelectors.selectUsers);
  readonly currentUser = this.store.select(toolbarSelectors.selectCurrentUser);
  readonly allPredictions = this.store.select(fullResultsSelectors.selectAllPredictions);
  readonly currentUserPredictions = combineLatest([this.currentUser, this.allPredictions]).pipe(
    map(([currentUser, allPredictions]) => allPredictions.filter(prediction => prediction.userid == currentUser?.id)));

  readonly races = this.store.select(fullResultsSelectors.selectRaces).pipe(shareReplay(1));
  readonly nextRaceRound = this.races.pipe(map(races => races.findIndex(nextRacePredicate) + ROUND_TO_INDEX_OFFSET));
  readonly isLoaded = combineLatest([this.users, this.races]).pipe(map(([users, races]) => !!races && !!users));

  readonly nextRacePredictions = combineLatest([this.allPredictions, this.nextRaceRound]).pipe(
    map(([allPredictions, nextRaceRound]) => allPredictions.filter(prediction => prediction.round === nextRaceRound)));

  readonly currentUserHasPrediction = combineLatest([this.currentUserPredictions, this.nextRaceRound]).pipe(
    map(([currentUserPredictions, round]) => (currentUserPredictions ?? []).some((prediction: Prediction) =>
        prediction.round === round &&
        prediction.qualification.filter(name => !!name).length &&
        prediction.race.filter(name => !!name).length,
      )),
  );

  readonly displayedColumns = this.users.pipe(
    map(users => users.map(user => 'user' + user.id)),
    map(userColumns => ['event', 'circuit', ...userColumns, 'empty', 'stats']),
  );

  constructor(
    private readonly predictionDialog: MatDialog,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.currentUserHasPrediction.subscribe();
    this.store.dispatch({type: FullResultsActionType.LOAD_RACES});
    this.store.dispatch({type: FullResultsActionType.LOAD_USERS});
    this.store.dispatch({type: FullResultsActionType.LOAD_ALL_PREDICTIONS});
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

  openPredictionDialog(userId: number, round: number, hasPrediction: boolean): void {
    this.predictionDialog.open(PredictionDialog, {
      disableClose: true,
      data: {userId, round, hasPrediction},
    });
  }

  hasPrediction(user: User, nextRacePredictions: Prediction[] | null): boolean {
    return (nextRacePredictions ?? []).some(prediction => prediction.userid == user.id);
  }
}

function nextRacePredicate(race: Race, index: number, races: Race[]): boolean {
  return NOW.isAfter(race.date) && NOW.isBefore(races[index + 1].date);
}
