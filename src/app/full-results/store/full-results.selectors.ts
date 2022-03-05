import {createFeatureSelector, createSelector} from '@ngrx/store';
import {FullResultsState} from './full-results.model';


export const selectFullResultsState = createFeatureSelector<FullResultsState>('fullResults');

export const selectSettings = createSelector(
    selectFullResultsState,
    (state: FullResultsState) => state,
);

export const selectIsLoaded = createSelector(
    selectSettings,
    (state: FullResultsState) => state.isLoaded,
);