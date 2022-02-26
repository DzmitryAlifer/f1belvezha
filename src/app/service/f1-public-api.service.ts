import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Driver, DriversResponse, Race, RacesResponse, Team, TeamsResponse} from '../types';
import {HttpClient} from '@angular/common/http';


const F1_PUBLIC_API = 'https://ergast.com/api/f1/';
const CURRENT_YEAR = new Date().getFullYear();


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
      map(response => response.MRData.DriverTable.Drivers));
  }
}
