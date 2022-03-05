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

export const selectUsers = createSelector(
    selectFullResults,
    (state: FullResultsState) => state.users,
);