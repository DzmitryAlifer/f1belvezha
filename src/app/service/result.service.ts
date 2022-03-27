import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {DriverRoundResult, Params, PlayerRoundResult} from '../types';
import {HttpService} from './http.service';


@Injectable({providedIn: 'root'})
export class ResultService {

  constructor(private readonly httpService: HttpService) {}

  getDriverYearResults(year: number): Observable<DriverRoundResult[]> {
    const queryParams: Params = {year: String(year)};
    return this.httpService.getByParams<DriverRoundResult[]>('/driverResult', queryParams);
  }

  getPlayersYearResults(year: number): Observable<PlayerRoundResult[]> {
    const queryParams: Params = {year: String(year)};
    return this.httpService.getByParams<PlayerRoundResult[]>('/playerResult', queryParams);
  }

  addPlayersResults(results: PlayerRoundResult[]): Observable<PlayerRoundResult[]> {
    return results.length ? this.httpService.post<PlayerRoundResult[]>('/playerResult', results) : of([]);
  }

  updatePlayersResults(results: PlayerRoundResult[]): Observable<PlayerRoundResult[]> {
    return results.length ? this.httpService.put<PlayerRoundResult[]>('/playerResult', results) : of([]);
  }
}
