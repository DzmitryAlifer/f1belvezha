import {Action} from '@ngrx/store';
import {Prediction, Race, ResultDb, User} from 'src/app/types';


export enum FullResultsActionType {
    SET_LOADED = '[Full Results] Set loaded state',
    LOAD_RACES = '[Full Results] Load races',
    LOAD_RACES_SUCCESS = '[Full Results] Load races - success',
    LOAD_USERS = '[Full Results] Load users',
    LOAD_USERS_SUCCESS = '[Full Results] Load users - success',
    LOAD_YEAR_RESULTS = '[Full Results] Load current year results',
    LOAD_YEAR_RESULTS_SUCCESS = '[Full Results] Load current year results - success',
    LOAD_ALL_PREDICTIONS = '[Full Results] Load all predictions',
    LOAD_ALL_PREDICTIONS_SUCCESS = '[Full Results] Load all predictions - success',
    LOAD_CURRENT_USER_PREDICTIONS = '[Full Results] Load current user predictions',
    LOAD_CURRENT_USER_PREDICTIONS_SUCCESS = '[Full Results] Load current user predictions - success',
}

export class SetLoaded implements Action {
    readonly type = FullResultsActionType.SET_LOADED;
    constructor(readonly payload: {isLoaded: boolean}) {}
}

export class LoadRaces implements Action {
    readonly type = FullResultsActionType.LOAD_RACES;
    constructor(readonly payload: {}) {}
}

export class LoadRacesSuccess implements Action {
    readonly type = FullResultsActionType.LOAD_RACES_SUCCESS;
    constructor(readonly payload: {races: Race[]}) {}
}

export class LoadUsers implements Action {
    readonly type = FullResultsActionType.LOAD_USERS;
    constructor(readonly payload: {}) {}
}

export class LoadUsersSuccess implements Action {
    readonly type = FullResultsActionType.LOAD_USERS_SUCCESS;
    constructor(readonly payload: {users: User[]}) {}
}

export class LoadYearResults implements Action {
    readonly type = FullResultsActionType.LOAD_YEAR_RESULTS;
    constructor(readonly payload: {}) {}
}

export class LoadYearResultsSuccess implements Action {
    readonly type = FullResultsActionType.LOAD_YEAR_RESULTS_SUCCESS;
    constructor(readonly payload: {yearResults: ResultDb[]}) {}
}

export class LoadAllPredictions implements Action {
    readonly type = FullResultsActionType.LOAD_ALL_PREDICTIONS;
    constructor(readonly payload: {}) {}
}

export class LoadAllPredictionsSuccess implements Action {
    readonly type = FullResultsActionType.LOAD_ALL_PREDICTIONS_SUCCESS;
    constructor(readonly payload: {predictions: Prediction[]}) {}
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
    | LoadRaces
    | LoadRacesSuccess
    | LoadUsers
    | LoadUsersSuccess
    | LoadYearResults
    | LoadYearResultsSuccess
    | LoadAllPredictions
    | LoadAllPredictionsSuccess
    | LoadCurrentUserPredictions
    | LoadCurrentUserPredictionsSuccess;
