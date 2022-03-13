import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DriverRoundResult, Params} from '../types';
import {HttpService} from './http.service';


@Injectable({providedIn: 'root'})
export class ResultService {

  constructor(private readonly httpService: HttpService) {}

  getDriverYearResults(year: number): Observable<DriverRoundResult[]> {
    const queryParams: Params = {year: String(year)};
    return this.httpService.getByParams<DriverRoundResult[]>('/driverResult', queryParams);
  }

  getUserYearResults(year: number): Observable<DriverRoundResult[]> {
    const queryParams: Params = { year: String(year) };
    return this.httpService.getByParams<DriverRoundResult[]>('/driverResult', queryParams);
  }
}
