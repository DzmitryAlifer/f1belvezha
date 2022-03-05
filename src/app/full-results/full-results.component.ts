import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Sort} from '@angular/material/sort';
import {BehaviorSubject, combineLatest, merge} from 'rxjs';
import {filter, map, shareReplay, switchMap} from 'rxjs/operators';
import {UserService} from '../service/user.service';
import {F1PublicApiService} from '../service/f1-public-api.service';
import {BehaviorService} from '../service/behavior.service';
import {ThemeService} from '../service/theme.service';
import {PredictionDialog} from '../prediction-dialog/prediction-dialog';
import {Prediction, Race} from '../types';
import * as moment from 'moment';
import {PredictionService} from '../service/prediction.service';


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
export class FullResultsComponent {
  readonly isDarkMode = this.themeService.isDarkMode();
  private readonly initialUsers = this.userService.getAllUsers().pipe(shareReplay(1));
  private readonly reloadedUsers = this.behaviorService.isUsersReload().pipe(switchMap(() => this.userService.getAllUsers()));
  readonly users = merge(this.initialUsers, this.reloadedUsers);
  
  readonly currentUser = merge(this.behaviorService.getCurrentUser(), this.userService.getCurrentUser());

  readonly currentUserPredictions = this.currentUser.pipe(
    filter(user => !!user?.id),
    switchMap(user => this.predictionService.getAllUserPredictions(user?.id!)),
  );

  readonly races = this.f1PublicApiService.getCurrentYearSchedule().pipe(shareReplay(1));
  readonly nextRaceRound = this.races.pipe(map(races => races.findIndex(nextRacePredicate) + ROUND_TO_INDEX_OFFSET));
  readonly isLoaded = combineLatest([this.users, this.races]).pipe(map(([users, races]) => !!races && !!users));
  private readonly userColumns = this.users.pipe(map(users => users.map(user => 'user' + user.id)));
  readonly displayedColumns = this.userColumns.pipe(map(userColumns => ['event', 'circuit', ...userColumns, 'empty', 'stats']));

  constructor(
    private readonly behaviorService: BehaviorService,
    private readonly f1PublicApiService: F1PublicApiService,
    private readonly predictionDialog: MatDialog,
    private readonly predictionService: PredictionService,
    private readonly themeService: ThemeService,
    private readonly userService: UserService,
  ) {}

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);

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

  hasPrediction(currentUserPredictions: Prediction[]|null, round: number): boolean {
    return (currentUserPredictions ?? []).some(prediction => 
      prediction.round === round && 
      prediction.qualification.filter(name => !!name) &&
      prediction.race.filter(name => !!name),
    );
  }
}

function nextRacePredicate(race: Race, index: number, races: Race[]): boolean {
  return NOW.isAfter(race.date) && NOW.isBefore(races[index + 1].date);
}
