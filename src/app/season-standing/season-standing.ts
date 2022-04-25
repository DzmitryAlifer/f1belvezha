import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Store} from '@ngrx/store';
import {combineLatest, Observable} from 'rxjs';
import {filter, map, shareReplay, switchMap} from 'rxjs/operators';
import {TEAM_DRIVER_IDS_MAPPING} from 'src/constants';
import {getBolidPath, getFlagLink, getNextEvent2} from '../common';
import {TeamName} from '../enums';
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

  readonly constructorStandingsControl = new FormControl();

  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly calendarRaces: Observable<Race[]> = this.store.select(toolbarSelectors.selectCalendar).pipe(shareReplay(1));
  private readonly nextEvent: Observable<DisplayEvent> = this.calendarRaces.pipe(switchMap(allEvents => getNextEvent2(allEvents)));
  
  readonly finishedRaces: Observable<Race[]> = combineLatest([this.calendarRaces, this.nextEvent]).pipe(
    filter(([calendarRaces, nextEvent]) => !!calendarRaces.length && !!nextEvent),
    map(([calendarRaces, nextEvent]) => calendarRaces.filter(race => race.round < nextEvent.round)));

  readonly driverStandings: Observable<DriverStanding[]> = this.f1PublicApiService.getDriverStandings();
  readonly constructorStandings: Observable<ConstructorStanding[]> = this.f1PublicApiService.getConstructorStandings();
  readonly driverResults: Observable<Array<Map<string, DriverStanding>>> = this.f1PublicApiService.getCurrentYearResults();
  
  readonly constructorResults: Observable<Array<Map<TeamName, number>>> = this.driverResults.pipe(
    map(driverResults => 
      driverResults.map(driverRaceResults => {
        const constructorRaceResultsMap = Array.from(TEAM_DRIVER_IDS_MAPPING).reduce((map, [teamName,]) => {
          const constructorRacePoints = this.getConstructorPointsInRace(driverRaceResults, teamName);
          map.set(teamName, constructorRacePoints);
          return map;
        }, new Map<TeamName, number>());
        return new Map([...constructorRaceResultsMap.entries()]
            .filter(entry => !!entry[1])
            .sort((left, right) => right[1] - left[1]));
      }),
    ),
  );

  constructor(
    private readonly f1PublicApiService: F1PublicApiService,
    private readonly store: Store,
  ) {}

  getFlagLink(countryName: string): string {
    return getFlagLink(countryName);
  }

  getDriverBolidPath(driverFamilyName: string): string {
    return getBolidPath(driverFamilyName);
  }

  getConstructorBolidPath(teamId: string): string {
    return `/assets/images/bolids/${teamId}.png`;
  }

  getDriverPositionInRace(driverResults: Array<Map<string, DriverStanding>>, raceIndex: number, driver: Driver): number {
    return driverResults[raceIndex]?.get(driver.driverId)?.position ?? 0;
  }

  getConstructorPointsInRace(driverRaceResults: Map<string, DriverStanding>, teamName: TeamName): number {
    const teamDriverIds = TEAM_DRIVER_IDS_MAPPING.get(teamName) ?? [];
    return teamDriverIds.reduce((sum, driverId) => sum + Number(driverRaceResults?.get(driverId)?.points ?? 0), 0);
  }

  getConstructorPositionInRace(constructorResults: Array<Map<TeamName, number>>, raceIndex: number, constructor: Team): number {
    const constructorRaceResultsMap = constructorResults[raceIndex];
    const constructorPoints = constructorRaceResultsMap.get(constructor.constructorId) ?? 0;
    const position = Array.from(constructorRaceResultsMap.values()).indexOf(constructorPoints) + 1;
    return position; 
  }
}
