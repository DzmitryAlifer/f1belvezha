import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {combineLatest, Observable} from 'rxjs';
import {filter, map, shareReplay, switchMap} from 'rxjs/operators';
import {getBolidPath, getFlagLink, getNextEvent2} from '../common';
import {F1PublicApiService} from '../service/f1-public-api.service';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';
import {ConstructorStanding, DisplayEvent, Driver, DriverStanding, Race, Team} from '../types';


@Component({
  selector: 'season-standing',
  templateUrl: './season-standing.html',
  styleUrls: ['./season-standing.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeasonStandingComponent {
  readonly Array = Array;
  readonly Number = Number;

  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly calendarRaces: Observable<Race[]> = this.store.select(toolbarSelectors.selectCalendar).pipe(shareReplay(1));
  private readonly nextEvent: Observable<DisplayEvent> = this.calendarRaces.pipe(switchMap(allEvents => getNextEvent2(allEvents)));
  
  readonly finishedRaces: Observable<Race[]> = combineLatest([this.calendarRaces, this.nextEvent]).pipe(
    filter(([calendarRaces, nextEvent]) => !!calendarRaces.length && !!nextEvent),
    map(([calendarRaces, nextEvent]) => calendarRaces.filter(race => race.round < nextEvent.round)));

  readonly driverStandings: Observable<DriverStanding[]> = this.f1PublicApiService.getDriverStandings();
  readonly constructorStandings: Observable<ConstructorStanding[]> = this.f1PublicApiService.getConstructorStandings();
  readonly results: Observable<Array<Map<string, number>>> = this.f1PublicApiService.getCurrentYearResults();

  constructor(
    private readonly f1PublicApiService: F1PublicApiService,
    private readonly store: Store,
  ) { this.results.subscribe(r=>console.log(r));}

  getFlagLink(countryName: string): string {
    return getFlagLink(countryName);
  }

  getDriverBolidPath(driverFamilyName: string): string {
    return getBolidPath(driverFamilyName);
  }

  getConstructorBolidPath(teamId: string): string {
    return `/assets/images/bolids/${teamId}.png`;
  }

  getDriverPositionInRace(results: Array<Map<string, number>>, raceIndex: number, driver: Driver): number {
    return results[raceIndex]?.get(driver.driverId) ?? 0;
  }

  getConstructorPositionInRace(results: Array<Map<string, number>>, raceIndex: number, constructor: Team): number {
    return results[raceIndex]?.get(constructor.constructorId) ?? 0;
  }
}
