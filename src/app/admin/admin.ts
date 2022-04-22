import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {combineLatest, ReplaySubject} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {formatDate, getFlagLink, getNextEvent} from '../common';
import {EventType} from '../enums';
import {ResultService} from '../service/result.service';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';
import {DriverRoundResult} from '../types';


const CURRENT_YEAR = new Date().getFullYear();


@Component({
  selector: 'admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  readonly EventType = EventType;

  readonly selectedQualifyingDrivers = new ReplaySubject<string[]>(1);
  readonly selectedRaceDrivers = new ReplaySubject<string[]>(1);

  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly nextRaceRound = getNextEvent().pipe(map(nextEvent => nextEvent.round));
  readonly results = this.resultService.getDriverYearResults(CURRENT_YEAR);
  private readonly allEvents = this.store.select(toolbarSelectors.selectCalendar);
  
  readonly availableEvents = combineLatest([this.allEvents, this.nextRaceRound]).pipe(
    map(([allEvents, nextRaceRound]) => allEvents.filter(event => event.round <= nextRaceRound)));

  constructor(
    private readonly resultService: ResultService,
    private readonly store: Store,
  ) {}

  formatDate(dateStr: string): string {
    return formatDate(dateStr);
  }

  getFlagLink(countryName: string): string {
    return getFlagLink(countryName);
  }

  findRoundResults(results: DriverRoundResult[] | null, round: number): DriverRoundResult|undefined {
    return (results ?? []).find(result => result.round === round);
  }

  hasQualifyingResults(results: DriverRoundResult[]|null, round: number): boolean {
    return !!this.findRoundResults(results, round)?.qualifying.length;
  }

  hasRaceResults(results: DriverRoundResult[] | null, round: number): boolean {
    return !!this.findRoundResults(results, round)?.race.length;
  }

  saveResults(results: DriverRoundResult[] | null, round: number): void {
    combineLatest([this.selectedQualifyingDrivers, this.selectedRaceDrivers]).pipe(
      switchMap(([qualifying, race]) => {
        const driverRoundResult: DriverRoundResult = {year: CURRENT_YEAR, round, qualifying, race};
        return results ? this.resultService.updateDriverRoundResults(driverRoundResult) : this.resultService.addDriverRoundResults(driverRoundResult);
      }),
    ).subscribe();
  }
}
