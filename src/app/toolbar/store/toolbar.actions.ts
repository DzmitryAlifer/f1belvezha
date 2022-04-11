import {Action} from '@ngrx/store';
import {Language, Page} from 'src/app/enums';
import {DisplayEvent, PlayerRoundResult, Race, User} from 'src/app/types';


export enum ToolbarActionType {
    SET_LANGUAGE = '[Toolbar] - Set language',
    SET_LANGUAGE_SUCCESS = '[Toolbar] - Set language - success',
    SET_START_PAGE = '[Toolbar] - Set start page',
    SET_START_PAGE_SUCCESS = '[Toolbar] - Set start page - success',
    SET_CURRENT_USER = '[Toolbar] Set current user',
    SET_DARK_MODE = '[Toolbar] Set dark mode',
    SET_DARK_MODE_SUCCESS = '[Toolbar] Set dark mode - success',
    SET_LOCKED_LAYOUT = '[Toolbar] Set locked layout',
    SET_LOCKED_LAYOUT_SUCCESS = '[Toolbar] Set locked layout - success',
    LOAD_CALENDAR = '[Toolbar] Load calendar',
    LOAD_CALENDAR_SUCCESS = '[Toolbar] Load calendar - success',
    LOAD_NEXT_EVENT = '[Toolbar] Load next event',
    LOAD_NEXT_EVENT_SUCCESS = '[Toolbar] Load next event - success',
    SET_LAST_ROUND = '[Toolbar] Set last round',
    SET_LAST_ROUND_SUCCESS = '[Toolbar] Set last round - success',
    SHOW_PAGE = '[Toolbar] Show page',
    LOAD_PLAYERS_RESULTS = '[Toolbar] Load players results',
    LOAD_PLAYERS_RESULTS_SUCCESS = '[Toolbar] Load players results - success',
}

export class SetLanguage implements Action {
    readonly type = ToolbarActionType.SET_LANGUAGE;
    constructor(readonly payload: {language: Language}) {}
}

export class SetStartPage implements Action {
    readonly type = ToolbarActionType.SET_START_PAGE;
    constructor(readonly payload: {startPage: Page}) {}
}

export class SetCurrentUser implements Action {
    readonly type = ToolbarActionType.SET_CURRENT_USER;
    constructor(readonly payload: {currentUser: User}) {}
}

export class SetDarkMode implements Action {
    readonly type = ToolbarActionType.SET_DARK_MODE;
    constructor(readonly payload: {isDarkMode: boolean}) {}
}

export class SetLockedLayout implements Action {
    readonly type = ToolbarActionType.SET_LOCKED_LAYOUT;
    constructor(readonly payload: {isLockedLayout: boolean}) {}
}

export class LoadCalendar implements Action {
    readonly type = ToolbarActionType.LOAD_CALENDAR;
    constructor(readonly payload: {}) {}
}

export class LoadCalendarSuccess implements Action {
    readonly type = ToolbarActionType.LOAD_CALENDAR_SUCCESS;
    constructor(readonly payload: {calendar: Race[]}) {}
}

export class LoadNextEvent implements Action {
    readonly type = ToolbarActionType.LOAD_NEXT_EVENT;
    constructor(readonly payload: {}) {}
}

export class LoadNextEventSuccess implements Action {
    readonly type = ToolbarActionType.LOAD_NEXT_EVENT_SUCCESS;
    constructor(readonly payload: {nextEvent: DisplayEvent}) {}
}

export class SetLastRound implements Action {
    readonly type = ToolbarActionType.SET_LAST_ROUND;
    constructor(readonly payload: {}) {}
}

export class SetLastRoundSuccess implements Action {
    readonly type = ToolbarActionType.SET_LAST_ROUND_SUCCESS;
    constructor(readonly payload: {lastRound: number}) {}
}

export class ShowPage implements Action {
    readonly type = ToolbarActionType.SHOW_PAGE;
    constructor(readonly payload: {page: Page}) {}
}

export class LoadPlayersResults implements Action {
    readonly type = ToolbarActionType.LOAD_PLAYERS_RESULTS;
    constructor(readonly payload: {}) {}
}

export class LoadPlayersResultsSuccess implements Action {
    readonly type = ToolbarActionType.LOAD_PLAYERS_RESULTS_SUCCESS;
    constructor(readonly payload: {playersResults: PlayerRoundResult[]}) {}
}

export type ToolbarAction =
    | SetLanguage
    | SetStartPage
    | SetCurrentUser
    | SetDarkMode
    | SetLockedLayout
    | LoadPlayersResults
    | LoadPlayersResultsSuccess
    | LoadCalendar
    | LoadCalendarSuccess
    | LoadNextEvent
    | LoadNextEventSuccess
    | SetLastRound
    | SetLastRoundSuccess
    | ShowPage;
