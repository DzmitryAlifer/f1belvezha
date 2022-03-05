import {Action} from '@ngrx/store';
import {Prediction, User} from 'src/app/types';


export enum FullResultsActionType {
    SET_LOADED = '[Full Results] Set loaded state',
    LOAD_USERS = '[Full Results] Load users',
    LOAD_USERS_SUCCESS = '[Full Results] Load users - success',
    LOAD_CURRENT_USER_PREDICTIONS = '[Full Results] Load current user predictions',
    LOAD_CURRENT_USER_PREDICTIONS_SUCCESS = '[Full Results] Load current user predictions - success',
}

export class SetLoaded implements Action {
    readonly type = FullResultsActionType.SET_LOADED;
    constructor(readonly payload: {isLoaded: boolean}) {}
}

export class LoadUsers implements Action {
    readonly type = FullResultsActionType.LOAD_USERS;
    constructor(readonly payload: {}) {}
}

export class LoadUsersSuccess implements Action {
    readonly type = FullResultsActionType.LOAD_USERS_SUCCESS;
    constructor(readonly payload: {users: User[]}) {}
}

export class LoadCurrentUserPredictions implements Action {
    readonly type = FullResultsActionType.LOAD_CURRENT_USER_PREDICTIONS;
    constructor(readonly payload: {}) {}
}

export class LoadCurrentUserPredictionsSuccess implements Action {
    readonly type = FullResultsActionType.LOAD_CURRENT_USER_PREDICTIONS_SUCCESS;
    constructor(readonly payload: {currentUserPredictions: Prediction[]}) {}
}

export type FullResultsAction =
    | SetLoaded
    | LoadUsers
    | LoadUsersSuccess
    | LoadCurrentUserPredictions
    | LoadCurrentUserPredictionsSuccess;
