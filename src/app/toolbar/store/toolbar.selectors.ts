import {createFeatureSelector, createSelector} from '@ngrx/store';
import {ToolbarState} from './toolbar.model';


const selectToolbarState = createFeatureSelector<ToolbarState>('toolbar');
const selectToolbar = createSelector(selectToolbarState, (state: ToolbarState) => state);

export const selectLanguage = createSelector(selectToolbar, (state: ToolbarState) => state.language);
export const selectCurrentUser = createSelector(selectToolbar, (state: ToolbarState) => state.currentUser);
export const selectPage = createSelector(selectToolbar, (state: ToolbarState) => state.page);
export const selectIsDarkMode = createSelector(selectToolbar, (state: ToolbarState) => state.isDarkMode);
export const selectIsLockedLayout = createSelector(selectToolbar, (state: ToolbarState) => state.isLockedLayout);
export const selectIsLoaded = createSelector(selectToolbar, (state: ToolbarState) => state?.isLoaded);
export const selectCalendar = createSelector(selectToolbar, (state: ToolbarState) => state?.calendar);
export const selectLastRound = createSelector(selectToolbar, (state: ToolbarState) => state?.lastRound);
export const selectPlayersResults = createSelector(selectToolbar, (state: ToolbarState) => state?.playersResults);
