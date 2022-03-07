import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Driver, DriversResponse, DriverStanding, DriverStandingsResponse, Race, RacesResponse, Team, TeamsResponse} from '../types';
import {HttpClient} from '@angular/common/http';


const F1_PUBLIC_API = 'https://ergast.com/api/f1/';
const CURRENT_YEAR = new Date().getFullYear();
const REMOVED_DRIVER_IDS = ['raikkonen', 'giovinazzi', 'kubica', 'russell'];
const NEW_DRIVERS = new Map<string, Driver>()
    .set('russell', {
      driverId: 'russell',
      permanentNumber: 63,
      code: 'RUS',
      url: 'http://en.wikipedia.org/wiki/George_Russell_%28racing_driver%29',
      givenName: 'George',
      familyName: 'Russell',
      dateOfBirth: '1998-02-15',
      nationality: 'British',
    })      
    .set('albon', {
      driverId: 'albon',
      permanentNumber: 0,
      code: 'ALB',
      url: '',
      givenName: 'Alexander',
      familyName: 'Albon',
      dateOfBirth: '1996-03-23',
      nationality: 'Thailand',
    })    
    .set('zhou', {
      driverId: 'zhou',
      permanentNumber: 0,
      code: 'ZHO',
      url: '',
      givenName: 'Guanyu',
      familyName: 'Zhou',
      dateOfBirth: '1999-05-30',
      nationality: 'China',
    });


@Injectable({providedIn: 'root'})
export class F1PublicApiService {
  private drivers: Observable<Driver[]>|null = null;
  private driverStandings: Observable<DriverStanding[]> | null = null;

  constructor(private readonly httpClient: HttpClient) {}

  getCurrentYearSchedule(): Observable<Race[]> {
    return this.httpClient.get<RacesResponse>(`${F1_PUBLIC_API}${CURRENT_YEAR}.json`).pipe(
      map(response => response.MRData.RaceTable.Races.map(race => ({...race, round: Number(race.round)}))));
  }

  getTeams(): Observable<Team[]> {
    return this.httpClient.get<TeamsResponse>(`${F1_PUBLIC_API}${CURRENT_YEAR - 1}/constructors.json`).pipe(
      map(response => response.MRData.ConstructorTable.Constructors));
  }

  getDrivers(): Observable<Driver[]> {
    if (!this.drivers) {
      this.drivers = this.httpClient.get<DriversResponse>(`${F1_PUBLIC_API}${CURRENT_YEAR - 1}/drivers.json`).pipe(
        map(response => {
          const drivers = 
              response.MRData.DriverTable.Drivers.filter(driver => !REMOVED_DRIVER_IDS.includes(driver.driverId));
  
          return [...drivers, ...NEW_DRIVERS.values()];
        }));
    }

    return this.drivers;
  }

  getDriverStandings(): Observable<DriverStanding[]> {
    if (!this.driverStandings) {
      this.driverStandings = this.httpClient.get<DriverStandingsResponse>(`${F1_PUBLIC_API}${CURRENT_YEAR}/driverStandings.json`).pipe(
        map(response => response.MRData.StandingsTable.StandingsLists[0].DriverStandings));
    }

    return this.driverStandings;
  }
}
