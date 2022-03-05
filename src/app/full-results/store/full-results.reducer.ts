import {FullResultsAction, FullResultsActionType} from './full-results.actions';
import {FullResultsState} from './full-results.model';


export const initialState: FullResultsState = {
    columns: ['event', 'circuit', 'empty', 'stats'],
    currentUser: null,
    currentUserPrediction: null,
    isAuthenticated: false,
    isLoaded: false,
    nextRound: 0,
    races: [],
    users: [],
};


export function fullResultsReducer(state: FullResultsState = initialState, action: FullResultsAction): FullResultsState {
    switch (action.type) {
        case FullResultsActionType.SET_LOADED:
            return {...state, isLoaded: action.payload.isLoaded};

        case FullResultsActionType.LOAD_USERS:
            return { ...state, isLoaded: false};

        case FullResultsActionType.LOAD_USERS_SUCCESS:
            return {...state, users: action.payload.users, isLoaded: true};

        default:
            return state;
    }
}
