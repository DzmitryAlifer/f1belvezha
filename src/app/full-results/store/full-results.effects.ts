import {Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {filter, map, switchMap} from 'rxjs/operators';
import {PredictionService} from 'src/app/service/prediction.service';
import {UserService} from '../../service/user.service';
import {FullResultsAction, FullResultsActionType} from './full-results.actions';
import * as toolbarSelectors from '../../toolbar/store/toolbar.selectors';
import {combineLatest} from 'rxjs';
import {F1PublicApiService} from 'src/app/service/f1-public-api.service';


@Injectable()
export class FullResultsEffects {
    private readonly users = this.userService.getAllUsers();
    private readonly currentUser = this.store.select(toolbarSelectors.selectCurrentUser);
    private readonly allPredictions = this.predictionService.getAllPredictions();
    private readonly races = this.f1PublicApiService.getCurrentYearSchedule();

    private readonly currentUserPredictions = combineLatest([this.currentUser, this.allPredictions]).pipe(
        filter(([currentUser, ]) => !!currentUser?.id),
        map(([currentUser, predictions]) => predictions.filter(prediction => prediction.userid == currentUser!.id!)),
    );

    constructor(
        private actions: Actions<FullResultsAction>,
        private readonly f1PublicApiService: F1PublicApiService,
        private readonly predictionService: PredictionService,
        private readonly store: Store,
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
}
