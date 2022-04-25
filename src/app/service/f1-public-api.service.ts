import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ConstructorStanding, ConstructorStandings, DriverStanding, DriverStandings, Race, RacesResponse, Result, ResultsResponse, StandingsResponse, Team, TeamsResponse} from '../types';
import {HttpClient} from '@angular/common/http';


const F1_PUBLIC_API = 'https://ergast.com/api/f1/';
const CURRENT_YEAR = new Date().getFullYear();


@Injectable({providedIn: 'root'})
export class F1PublicApiService {
  private driverStandings: Observable<DriverStanding[]> | null = null;
  private constructorStandings: Observable<ConstructorStanding[]> | null = null;

  constructor(private readonly httpClient: HttpClient) {}

  getCurrentCalendar(): Observable<Race[]> {
    return this.httpClient.get<RacesResponse>(`${F1_PUBLIC_API}current.json`).pipe(
      map(response => response.MRData.RaceTable.Races.map(race => ({
        ...race,
        season: Number(race.season),
        round: Number(race.round),
      }))));
  }

  getCurrentYearSchedule(): Observable<Race[]> {
    return this.httpClient.get<RacesResponse>(`${F1_PUBLIC_API}${CURRENT_YEAR}.json`).pipe(
      map(response => response.MRData.RaceTable.Races.map(race => ({...race, round: Number(race.round)}))));
  }

  getTeams(): Observable<Team[]> {
    return this.httpClient.get<TeamsResponse>(`${F1_PUBLIC_API}${CURRENT_YEAR - 1}/constructors.json`).pipe(
      map(response => response.MRData.ConstructorTable.Constructors));
  }

  getDriverStandings(): Observable<DriverStanding[]> {
    if (!this.driverStandings) {
      this.driverStandings = this.httpClient.get<StandingsResponse>(`${F1_PUBLIC_API}${CURRENT_YEAR}/driverStandings.json`).pipe(
        map(response => (response.MRData.StandingsTable.StandingsLists as DriverStandings[])[0].DriverStandings));
    }

    return this.driverStandings;
  }

  getConstructorStandings(): Observable<ConstructorStanding[]> {
    if (!this.constructorStandings) {
      this.constructorStandings = this.httpClient.get<StandingsResponse>(`${F1_PUBLIC_API}${CURRENT_YEAR}/constructorStandings.json`).pipe(
        map(response => (response.MRData.StandingsTable.StandingsLists as ConstructorStandings[])[0].ConstructorStandings));
    }

    return this.constructorStandings;
  }

  getQualifyingResults(round: number): Observable<Map<string, DriverStanding>> {
    return this.httpClient.get<ResultsResponse>(`${F1_PUBLIC_API}${CURRENT_YEAR}/${round}/qualifying.json`).pipe(
      map(response => this.convertApiResponse(response.MRData.RaceTable.Races[0].QualifyingResults!)));
  }

  getCurrentYearResults(): Observable<Array<Map<string, DriverStanding>>> {
    return this.httpClient.get<ResultsResponse>(`${F1_PUBLIC_API}${CURRENT_YEAR}/results.json?limit=1000`).pipe(
      map(response => response.MRData.RaceTable.Races.map(race => this.convertApiResponse(race.Results!))));
  }

  getRaceResults(round: number): Observable<Map<string, DriverStanding>> {
    return this.httpClient.get<ResultsResponse>(`${F1_PUBLIC_API}${CURRENT_YEAR}/${round}/results.json`).pipe(
      map(response => this.convertApiResponse(response.MRData.RaceTable.Races[0].Results!)));
  }

  private convertApiResponse(apiResults: DriverStanding[]) {
    return apiResults.reduce((resultsMap, result) => {
      resultsMap.set(result.Driver.driverId, result);
      return resultsMap;
    }, new Map<string, DriverStanding>());
  }
}
