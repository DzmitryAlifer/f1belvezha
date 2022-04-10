import {FullResultsAction, FullResultsActionType} from './full-results.actions';
import {FullResultsState} from './full-results.model';


export const initialState: FullResultsState = {
    columns: ['event', 'circuit', 'empty', 'stats'],
    currentUser: null,
    currentUserPredictions: [],
    currentYearPoints: new Map<number, Map<number, number[][]>>(),
    currentYearDriverResults: [],
    isAuthenticated: false,
    isLoaded: false,
    nextRaceTeamVsTeamList: [],
    nextRound: 0,
    nextRoundPredictions: [],
    predictions: [],
    races: [],
    users: [],
    yearTeamVsTeamList: [],
};


export function fullResultsReducer(state: FullResultsState = initialState, action: FullResultsAction): FullResultsState {
    switch (action.type) {
        case FullResultsActionType.SET_LOADED:
            return {...state, isLoaded: action.payload.isLoaded};

        case FullResultsActionType.LOAD_RACES:
        case FullResultsActionType.LOAD_USERS:
        case FullResultsActionType.LOAD_NEXT_RACE_TEAM_VS_TEAM_LIST:
        case FullResultsActionType.LOAD_YEAR_TEAM_VS_TEAM_LIST:
        case FullResultsActionType.LOAD_CURRENT_YEAR_RESULTS:
        case FullResultsActionType.LOAD_ALL_PREDICTIONS:
        case FullResultsActionType.LOAD_CURRENT_USER_PREDICTIONS:
        case FullResultsActionType.CALCULATE_CURRENT_YEAR_POINTS:
            return {...state, isLoaded: false};

        case FullResultsActionType.LOAD_RACES_SUCCESS:
            return {...state, races: action.payload.races, isLoaded: true};

        case FullResultsActionType.LOAD_USERS_SUCCESS:
            return {...state, users: action.payload.users, isLoaded: true};

        case FullResultsActionType.LOAD_NEXT_RACE_TEAM_VS_TEAM_LIST_SUCCESS:
            return {...state, nextRaceTeamVsTeamList: action.payload.nextRaceTeamVsTeamList, isLoaded: true};

        case FullResultsActionType.LOAD_YEAR_TEAM_VS_TEAM_LIST_SUCCESS:
            return {...state, yearTeamVsTeamList: action.payload.yearTeamVsTeamList, isLoaded: true };

        case FullResultsActionType.LOAD_CURRENT_YEAR_RESULTS_SUCCESS:
            return {...state, currentYearDriverResults: action.payload.currentYearDriverResults, isLoaded: true};

        case FullResultsActionType.LOAD_ALL_PREDICTIONS_SUCCESS:
            return {...state, predictions: action.payload.predictions, isLoaded: true};

        case FullResultsActionType.LOAD_CURRENT_USER_PREDICTIONS_SUCCESS:
            return {...state, currentUserPredictions: action.payload.currentUserPredictions, isLoaded: true};

        case FullResultsActionType.CALCULATE_CURRENT_YEAR_POINTS_SUCCESS:
            return {...state, currentYearPoints: action.payload.currentYearPoints, isLoaded: true};
        
        default:
            return state;
    }
}
