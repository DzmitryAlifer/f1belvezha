import {createFeatureSelector, createSelector} from '@ngrx/store';
import {FullResultsState} from './full-results.model';


export const selectFullResultsState = createFeatureSelector<FullResultsState>('fullResults');

const selectFullResults = createSelector(
    selectFullResultsState,
    (state: FullResultsState) => state,
);

export const selectIsLoaded = createSelector(
    selectFullResults,
    (state: FullResultsState) => state.isLoaded,
);

export const selectRaces = createSelector(
    selectFullResults,
    (state: FullResultsState) => state.races,
);

export const selectUsers = createSelector(
    selectFullResults,
    (state: FullResultsState) => state.users,
);

export const selectCurrentYearResults = createSelector(
    selectFullResults,
    (state: FullResultsState) => state.currentYearResults,
);

export const selectAllPredictions = createSelector(
    selectFullResults,
    (state: FullResultsState) => state.predictions,
);

export const selectCurrentUserPredictions = createSelector(
    selectFullResults,
    (state: FullResultsState) => state.currentUserPredictions,
);

export const selectNextRoundPredictions = createSelector(
    selectFullResults,
    (state: FullResultsState) => state.nextRoundPredictions,
);
