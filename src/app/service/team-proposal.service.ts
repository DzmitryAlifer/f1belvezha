import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {getNextEvent} from '../common';
import {Params, TeamVsTeam} from '../types';
import {HttpService} from './http.service';


const CURRENT_YEAR = new Date().getFullYear();


@Injectable({providedIn: 'root'})
export class TeamProposalService {

  private readonly nextRound = getNextEvent().pipe(map(({round}) => round));

  constructor(private readonly httpService: HttpService) {}

  getNextRaceTeamVsTeamProposals(): Observable<TeamVsTeam[]> {
    return this.nextRound.pipe(
      switchMap((nextRound: number) => {
        const queryParams: Params = {year: CURRENT_YEAR, round: nextRound};
        return this.httpService.getByParams<TeamVsTeam[]>('/teamVsTeam', queryParams);
      }),
    );
  }

  getTeamYearResults(year: number): Observable<TeamVsTeam[]> {
    const queryParams: Params = {year: String(year)};
    return this.httpService.getByParams<TeamVsTeam[]>('/teamVsTeam', queryParams);
  }

}
