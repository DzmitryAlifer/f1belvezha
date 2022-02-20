import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Race } from '../types';
import { HttpClient } from '@angular/common/http';

const SCHEDULE_API = 'http://ergast.com/api/f1/';
const CURRENT_YEAR = new Date().getFullYear();

@Injectable({providedIn: 'root'})
export class ScheduleService {

  constructor(private readonly httpClient: HttpClient) {}

  getCurrentYearSchedule(): Observable<Race[]> {
    return this.httpClient.get<Race[]>(`${SCHEDULE_API}${CURRENT_YEAR}.json`);
  }
}
