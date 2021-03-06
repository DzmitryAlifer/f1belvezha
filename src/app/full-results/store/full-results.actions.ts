import {Action} from '@ngrx/store';
import {DriverRoundResult, Prediction, Race, TeamVsTeam, User} from 'src/app/types';


export enum FullResultsActionType {
    SET_LOADED = '[Full Results] Set loaded state',
    LOAD_RACES = '[Full Results] Load races',
    LOAD_RACES_SUCCESS = '[Full Results] Load races - success',
    LOAD_USERS = '[Full Results] Load users',
    LOAD_USERS_SUCCESS = '[Full Results] Load users - success',
    LOAD_NEXT_RACE_TEAM_VS_TEAM_LIST = '[Full Results] Load team vs team proposals for next race',
    LOAD_NEXT_RACE_TEAM_VS_TEAM_LIST_SUCCESS = '[Full Results] Load team vs team proposals for next race - success',
    LOAD_YEAR_TEAM_VS_TEAM_LIST = '[Full Results] Load team vs team results for the current year',
    LOAD_YEAR_TEAM_VS_TEAM_LIST_SUCCESS = '[Full Results] Load team vs team results for the current year - success',
    LOAD_CURRENT_YEAR_RESULTS = '[Full Results] Load current year results',
    LOAD_CURRENT_YEAR_RESULTS_SUCCESS = '[Full Results] Load current year results - success',
    LOAD_ALL_PREDICTIONS = '[Full Results] Load all predictions',
    LOAD_ALL_PREDICTIONS_SUCCESS = '[Full Results] Load all predictions - success',
    LOAD_CURRENT_USER_PREDICTIONS = '[Full Results] Load current user predictions',
    LOAD_CURRENT_USER_PREDICTIONS_SUCCESS = '[Full Results] Load current user predictions - success',
    CALCULATE_CURRENT_YEAR_POINTS = '[Full Results] Calculate current year points',
    CALCULATE_CURRENT_YEAR_POINTS_SUCCESS = '[Full Results] Calculate current year points - success',
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

export class LoadNextRaceTeamVsTeamList implements Action {
    readonly type = FullResultsActionType.LOAD_NEXT_RACE_TEAM_VS_TEAM_LIST;
    constructor(readonly payload: {}) {}
}

export class LoadNextRaceTeamVsTeamListSuccess implements Action {
    readonly type = FullResultsActionType.LOAD_NEXT_RACE_TEAM_VS_TEAM_LIST_SUCCESS;
    constructor(readonly payload: {nextRaceTeamVsTeamList: TeamVsTeam[]}) {}
}

export class LoadYearTeamVsTeamList implements Action {
    readonly type = FullResultsActionType.LOAD_YEAR_TEAM_VS_TEAM_LIST;
    constructor(readonly payload: {}) {}
}

export class LoadYearTeamVsTeamListSuccess implements Action {
    readonly type = FullResultsActionType.LOAD_YEAR_TEAM_VS_TEAM_LIST_SUCCESS;
    constructor(readonly payload: {yearTeamVsTeamList: TeamVsTeam[]}) {}
}

export class LoadCurrentYearResults implements Action {
    readonly type = FullResultsActionType.LOAD_CURRENT_YEAR_RESULTS;
    constructor(readonly payload: {}) {}
}

export class LoadCurrentYearResultsSuccess implements Action {
    readonly type = FullResultsActionType.LOAD_CURRENT_YEAR_RESULTS_SUCCESS;
    constructor(readonly payload: {currentYearDriverResults: DriverRoundResult[]}) {}
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

export class CalculateCurrentYearPoints implements Action {
    readonly type = FullResultsActionType.CALCULATE_CURRENT_YEAR_POINTS;
    constructor(readonly payload: {}) {}
}

export class CalculateCurrentYearPointsSuccess implements Action {
    readonly type = FullResultsActionType.CALCULATE_CURRENT_YEAR_POINTS_SUCCESS;
    constructor(readonly payload: {currentYearPoints: Map<number, Map<number, number[][]>>}) {}
}

export type FullResultsAction =
    | SetLoaded
    | LoadRaces
    | LoadRacesSuccess
    | LoadUsers
    | LoadUsersSuccess
    | LoadNextRaceTeamVsTeamList
    | LoadNextRaceTeamVsTeamListSuccess
    | LoadYearTeamVsTeamList
    | LoadYearTeamVsTeamListSuccess
    | LoadCurrentYearResults
    | LoadCurrentYearResultsSuccess
    | LoadAllPredictions
    | LoadAllPredictionsSuccess
    | LoadCurrentUserPredictions
    | LoadCurrentUserPredictionsSuccess
    | CalculateCurrentYearPoints
    | CalculateCurrentYearPointsSuccess;
