import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {PredictionDialog} from '../prediction-dialog/prediction-dialog';
import {Prediction, Race} from '../types';
import * as moment from 'moment';
import * as fullResultsSelectors from './store/full-results.selectors';
import {FullResultsActionType} from './store/full-results.actions';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';


const NOW = moment();
const ROUND_TO_INDEX_OFFSET = 2;

const COUNTRY_MAP = new Map<string, string>()
    .set('Bahrain', 'BH')
    .set('Saudi Arabia', 'SA')
    .set('Australia', 'AU')
    .set('Italy', 'IT')
    .set('United States', 'US')
    .set('Spain', 'ES')
    .set('Monaco', 'MC')
    .set('Azerbaijan', 'AZ')
    .set('Canada', 'CA')
    .set('UK', 'GB')
    .set('Austria', 'AT')
    .set('France', 'FR')
    .set('Hungary', 'HU')
    .set('Belgium', 'BE')
    .set('Netherlands', 'NL')
    .set('Russia', 'RU')
    .set('Singapore', 'SG')
    .set('Japan', 'JP')
    .set('USA', 'US')
    .set('Mexico', 'MX')
    .set('Brazil', 'BR')
    .set('UAE', 'AE');

    
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

  readonly hasPrediction = combineLatest([this.currentUserPredictions, this.nextRaceRound]).pipe(
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
    this.hasPrediction.subscribe();
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
    return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${COUNTRY_MAP.get(countryName)}.svg`;
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
}

function nextRacePredicate(race: Race, index: number, races: Race[]): boolean {
  return NOW.isAfter(race.date) && NOW.isBefore(races[index + 1].date);
}
