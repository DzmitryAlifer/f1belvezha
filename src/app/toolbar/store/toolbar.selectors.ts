import {createFeatureSelector, createSelector} from '@ngrx/store';
import {ToolbarState} from './toolbar.model';


export const selectToolbarState = createFeatureSelector<ToolbarState>('toolbar');

const selectToolbar = createSelector(
    selectToolbarState,
    (state: ToolbarState) => state,
);

export const selectCurrentUser = createSelector(
    selectToolbar,
    (state: ToolbarState) => state.currentUser,
);