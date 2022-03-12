import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Params, ResultDb} from '../types';
import {HttpService} from './http.service';


@Injectable({providedIn: 'root'})
export class ResultService {

  constructor(private readonly httpService: HttpService) {}

  getYearResults(year: number): Observable<ResultDb> {
    const queryParams: Params = {year: String(year)};
    return this.httpService.getByParams<ResultDb>('/result', queryParams);
  }
}
