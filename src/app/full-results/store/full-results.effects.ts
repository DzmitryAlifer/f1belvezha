import {Injectable } from '@angular/core';
import {Actions, createEffect, ofType } from '@ngrx/effects';
import {map, switchMap} from 'rxjs/operators';
import {PredictionService} from 'src/app/service/prediction.service';
import {UserService} from '../../service/user.service';
import {FullResultsAction, FullResultsActionType} from './full-results.actions';


@Injectable()
export class FullResultsEffects {
    private readonly users = this.userService.getAllUsers();
    private readonly currentUserPredictions = this.userService.getCurrentUser().pipe(
        switchMap(currentUser => this.predictionService.getAllUserPredictions(currentUser?.id!)));

    constructor(
        private actions: Actions<FullResultsAction>,
        private readonly predictionService: PredictionService,
        private userService: UserService,
    ) {}

    loadUsers = createEffect(() => this.actions.pipe(
        ofType(FullResultsActionType.LOAD_USERS),
        switchMap(() => this.users.pipe(
            map(users => ({type: FullResultsActionType.LOAD_USERS_SUCCESS, payload: {users}})),
        ))
    ));

    loadCurrentUserPredictions = createEffect(() => this.actions.pipe(
        ofType(FullResultsActionType.LOAD_CURRENT_USER_PREDICTIONS),
        switchMap(() => this.currentUserPredictions.pipe(
            map(currentUserPredictions => 
                ({type: FullResultsActionType.LOAD_CURRENT_USER_PREDICTIONS_SUCCESS, payload: {currentUserPredictions}})),
        )),
    ));
}
