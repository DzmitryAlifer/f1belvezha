import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Race, Season } from '../types';
import { HttpClient } from '@angular/common/http';


const SCHEDULE_API = 'https://ergast.com/api/f1/';
const CURRENT_YEAR = new Date().getFullYear();


@Injectable({providedIn: 'root'})
export class F1PublicApiService {

  constructor(private readonly httpClient: HttpClient) {}

  getCurrentYearSchedule(): Observable<Race[]> {
    return this.httpClient.get<Season>(`${SCHEDULE_API}${CURRENT_YEAR}.json`).pipe(
      map(season => season.MRData.RaceTable.Races));
  }
}
