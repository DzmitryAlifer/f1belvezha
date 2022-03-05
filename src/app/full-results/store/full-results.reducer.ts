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


export function settingsReducer(state: FullResultsState = initialState, action: FullResultsAction): FullResultsState {
    switch (action.type) {
        case FullResultsActionType.SET_LOADED:
            return {...state, ...action.payload};

        case FullResultsActionType.ACTION_2:
            return {...state, ...action.payload};

        default:
            return state;
    }
}
