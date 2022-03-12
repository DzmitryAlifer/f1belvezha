import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DriverStanding, DriverStandingsResponse, Race, RacesResponse, Result, ResultsResponse, Team, TeamsResponse} from '../types';
import {HttpClient} from '@angular/common/http';


const F1_PUBLIC_API = 'https://ergast.com/api/f1/';
const CURRENT_YEAR = new Date().getFullYear();


@Injectable({providedIn: 'root'})
export class F1PublicApiService {
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

  getDriverStandings(): Observable<DriverStanding[]> {
    if (!this.driverStandings) {
      this.driverStandings = this.httpClient.get<DriverStandingsResponse>(`${F1_PUBLIC_API}${CURRENT_YEAR}/driverStandings.json`).pipe(
        map(response => response.MRData.StandingsTable.StandingsLists[0].DriverStandings));
    }

    return this.driverStandings;
  }

  getQualifyingResults(round: number): Observable<Map<string, number>> {
    return this.httpClient.get<ResultsResponse>(`${F1_PUBLIC_API}${CURRENT_YEAR}/${round}/qualifying.json`).pipe(
      map(response => this.convertApiResponse(response.MRData.RaceTable.Races[0].QualifyingResults!)));
  }

  getRaceResults(round: number): Observable<Map<string, number>> {
    return this.httpClient.get<ResultsResponse>(`${F1_PUBLIC_API}${CURRENT_YEAR}/${round}/results.json`).pipe(
      map(response => this.convertApiResponse(response.MRData.RaceTable.Races[0].Results!)));
  }

  private convertApiResponse(apiResults: Result[]) {
    return apiResults.reduce((resultsMap, qualifyingResult) => {
      resultsMap.set(qualifyingResult.Driver.driverId, qualifyingResult.position);
      return resultsMap;
    }, new Map<string, number>());
  }
}
