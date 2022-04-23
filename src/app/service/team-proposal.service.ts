import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {filter, map, switchMap} from 'rxjs/operators';
import {getNextEvent, getNextEvent2} from '../common';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';
import {Params, TeamVsTeam} from '../types';
import {HttpService} from './http.service';


const CURRENT_YEAR = new Date().getFullYear();


@Injectable({providedIn: 'root'})
export class TeamProposalService {

  private readonly nextRound = this.store.select(toolbarSelectors.selectCalendar).pipe(
    switchMap(allEvents => getNextEvent2(allEvents)),
    filter(nextEvent => !!nextEvent),
    map(nextEvent => nextEvent.round),
  );

  constructor(
    private readonly httpService: HttpService,
    private readonly store: Store,
  ) {}

  getNextRaceTeamVsTeamList(): Observable<TeamVsTeam[]> {
    return this.nextRound.pipe(
      switchMap((nextRound: number) => {
        const queryParams: Params = {year: CURRENT_YEAR, round: nextRound};
        return this.httpService.getByParams<TeamVsTeam[]>('/teamVsTeam/round', queryParams);
      }),
    );
  }

  getYearTeamVsTeamResults(year: number): Observable<TeamVsTeam[]> {
    const queryParams: Params = {year: String(year)};
    return this.httpService.getByParams<TeamVsTeam[]>('/teamVsTeam/year', queryParams);
  }
}
