import {Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {debounceTime, filter, map, switchMap} from 'rxjs/operators';
import {PredictionService} from 'src/app/service/prediction.service';
import {UserService} from '../../service/user.service';
import {FullResultsAction, FullResultsActionType} from './full-results.actions';
import * as toolbarSelectors from '../../toolbar/store/toolbar.selectors';
import {F1PublicApiService} from 'src/app/service/f1-public-api.service';
import {ResultService} from 'src/app/service/result.service';
import {calculateRoundPoints} from 'src/app/common';
import {TeamProposalService} from 'src/app/service/team-proposal.service';


const CURRENT_YEAR = new Date().getFullYear();


@Injectable()
export class FullResultsEffects {
    private readonly users = this.userService.getAllUsers();
    private readonly currentUser = this.store.select(toolbarSelectors.selectCurrentUser);
    private readonly currentYearResults = this.resultService.getDriverYearResults(CURRENT_YEAR);
    private readonly allPredictions = this.predictionService.getAllPredictions();
    private readonly races = this.f1PublicApiService.getCurrentYearSchedule();
    private readonly nextRaceTeamVsTeamList = this.teamProposalService.getNextRaceTeamVsTeamList();

    private readonly currentUserPredictions = combineLatest([this.currentUser, this.allPredictions]).pipe(
        filter(([currentUser, ]) => !!currentUser?.id),
        map(([currentUser, predictions]) => predictions.filter(prediction => prediction.userid == currentUser!.id!)),
    );

    private readonly currentYearPoints = combineLatest([this.currentYearResults, this.allPredictions, this.users]).pipe(
        debounceTime(0),
        map(([results, allRacesPredictions, users]) => 
            users.reduce((userResults, user) => {
                const allRacesUserPredictions = allRacesPredictions.filter(prediction => prediction.userid == user.id!);
                const singleUserResults = allRacesUserPredictions.reduce((acc, prediction) => {
                    const round = prediction.round!
                    const roundResult = results[round - 1];
                    const userRoundPoints = calculateRoundPoints(roundResult, prediction);
                    acc.set(round, userRoundPoints);
                    return acc;
                }, new Map<number, Array<number[]|null>>());
                userResults.set(user.id!, singleUserResults);
                return userResults;
            }, new Map<number, Map<number, Array<number[]|null>>>())),
    );

    constructor(
        private actions: Actions<FullResultsAction>,
        private readonly f1PublicApiService: F1PublicApiService,
        private readonly predictionService: PredictionService,
        private readonly resultService: ResultService,
        private readonly store: Store,
        private readonly teamProposalService: TeamProposalService,
        private readonly userService: UserService,
    ) {}

    loadRaces = createEffect(() => this.actions.pipe(
        ofType(FullResultsActionType.LOAD_RACES),
        switchMap(() => this.races.pipe(
            map(races => ({type: FullResultsActionType.LOAD_RACES_SUCCESS, payload: {races}})),
        ))
    ));

    loadUsers = createEffect(() => this.actions.pipe(
        ofType(FullResultsActionType.LOAD_USERS),
        switchMap(() => this.users.pipe(
            map(users => ({type: FullResultsActionType.LOAD_USERS_SUCCESS, payload: {users}})),
        ))
    ));

    loadNextRoundTeamVsTeamProposals = createEffect(() => this.actions.pipe(
        ofType(FullResultsActionType.LOAD_NEXT_RACE_TEAM_VS_TEAM_PROPOSALS),
        switchMap(() => this.nextRaceTeamVsTeamList.pipe(
            map(nextRaceTeamVsTeamList => ({
                type: FullResultsActionType.LOAD_NEXT_RACE_TEAM_VS_TEAM_PROPOSALS_SUCCESS,
                payload: {nextRaceTeamVsTeamList},
            })),
        ))
    ));

    loadYearResults = createEffect(() => this.actions.pipe(
        ofType(FullResultsActionType.LOAD_CURRENT_YEAR_RESULTS),
        switchMap(() => this.currentYearResults.pipe(
            map(currentYearResults => ({type: FullResultsActionType.LOAD_CURRENT_YEAR_RESULTS_SUCCESS, payload: {currentYearResults}})),
        ))
    ));

    loadAllPredictions = createEffect(() => this.actions.pipe(
        ofType(FullResultsActionType.LOAD_ALL_PREDICTIONS),
        switchMap(() => this.allPredictions.pipe(
            map(predictions =>
                ({type: FullResultsActionType.LOAD_ALL_PREDICTIONS_SUCCESS, payload: {predictions}})),
        )),
    ));

    loadCurrentUserPredictions = createEffect(() => this.actions.pipe(
        ofType(FullResultsActionType.LOAD_CURRENT_USER_PREDICTIONS),
        switchMap(() => this.currentUserPredictions.pipe(
            map(currentUserPredictions => 
                ({type: FullResultsActionType.LOAD_CURRENT_USER_PREDICTIONS_SUCCESS, payload: {currentUserPredictions}})),
        )),
    ));

    loadYearPoints = createEffect(() => this.actions.pipe(
        ofType(FullResultsActionType.CALCULATE_CURRENT_YEAR_POINTS),
        switchMap(() => this.currentYearPoints.pipe(
            map(currentYearPoints => 
                ({type: FullResultsActionType.CALCULATE_CURRENT_YEAR_POINTS_SUCCESS, payload: {currentYearPoints}})),
        ))
    ));
}
