import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {getNextEvent} from '../common';
import {Params, TeamVsTeamProposal} from '../types';
import {HttpService} from './http.service';


const CURRENT_YEAR = new Date().getFullYear();


@Injectable({providedIn: 'root'})
export class TeamProposalService {

  private readonly nextRound = getNextEvent().pipe(map(({round}) => round));

  constructor(private readonly httpService: HttpService) {}

  getNextRaceTeamVsTeamProposals(): Observable<TeamVsTeamProposal[]> {
    return this.nextRound.pipe(
      switchMap((nextRound: number) => {
        const queryParams: Params = {year: CURRENT_YEAR, round: nextRound};
        return this.httpService.getByParams<TeamVsTeamProposal[]>('/teamVsTeamProposal', queryParams);
      }),
    );
  }
}
