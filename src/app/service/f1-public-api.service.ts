import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Driver, DriversResponse, Race, RacesResponse, Team, TeamsResponse} from '../types';
import {HttpClient} from '@angular/common/http';


const F1_PUBLIC_API = 'https://ergast.com/api/f1/';
const CURRENT_YEAR = new Date().getFullYear();
const REMOVED_DRIVER_IDS = ['raikkonen', 'giovinazzi', 'kubica'];
const NEW_DRIVERS = new Map<string, Driver>()
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
const DRIVER_TEAM_MAPPING = new Map<string, string>()
    .set('hamilton', 'mercedes')
    .set('russel', 'mercedes')
    .set('max_verstappen', 'red_bull')
    .set('perez', 'red_bull')
    .set('sainz', 'ferrari')
    .set('leclerc', 'ferrari')
    .set('norris', 'mclaren')
    .set('ricciardo', 'mclaren')
    .set('ocon', 'alpine')
    .set('alonso', 'alpine')
    .set('gasly', 'alphatauri')
    .set('tsunoda', 'alphatauri')
    .set('stroll', 'aston_martin')
    .set('vettel', 'aston_martin')
    .set('albon', 'williams')
    .set('latifi', 'williams')
    .set('bottas', 'alfa')
    .set('zhou', 'alfa')
    .set('mick_schumacher', 'haas')    
    .set('mazepin', 'haas');


@Injectable({providedIn: 'root'})
export class F1PublicApiService {

  constructor(private readonly httpClient: HttpClient) {}

  getCurrentYearSchedule(): Observable<Race[]> {
    return this.httpClient.get<RacesResponse>(`${F1_PUBLIC_API}${CURRENT_YEAR}.json`).pipe(
      map(response => response.MRData.RaceTable.Races));
  }

  getTeams(): Observable<Team[]> {
    return this.httpClient.get<TeamsResponse>(`${F1_PUBLIC_API}${CURRENT_YEAR - 1}/constructors.json`).pipe(
      map(response => response.MRData.ConstructorTable.Constructors));
  }

  getDrivers(): Observable<Driver[]> {
    return this.httpClient.get<DriversResponse>(`${F1_PUBLIC_API}${CURRENT_YEAR - 1}/drivers.json`).pipe(
      map(response => {
        const drivers = 
            response.MRData.DriverTable.Drivers.filter(driver => !REMOVED_DRIVER_IDS.includes(driver.driverId));

        return [...drivers, ...NEW_DRIVERS.values()];
      }));
  }
}
