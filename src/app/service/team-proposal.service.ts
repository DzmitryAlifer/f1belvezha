import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';
import {Params, TeamVsTeamProposal} from '../types';
import {HttpService} from './http.service';


const CURRENT_YEAR = new Date().getFullYear();


@Injectable({providedIn: 'root'})
export class TeamProposalService {

  private readonly nextRound = this.store.select(toolbarSelectors.selectLastRound).pipe(map(round => round + 1));

  constructor(
    private readonly httpService: HttpService,
    private readonly store: Store,
  ) {}

  getNextRoundTeamVsTeamProposals(): Observable<TeamVsTeamProposal[]> {
    return this.nextRound.pipe(
      switchMap((nextRound: number) => {
        const queryParams: Params = {year: CURRENT_YEAR, round: nextRound};
        return this.httpService.getByParams<TeamVsTeamProposal[]>('/teamVsTeamProposal', queryParams);
      }),
    );
  }
}
