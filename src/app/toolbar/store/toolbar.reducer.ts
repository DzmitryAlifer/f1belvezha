import {Language, Page} from 'src/app/enums';
import {Theme} from 'src/app/service/theme.service';
import {User} from 'src/app/types';
import {CURRENT_USER_KEY} from 'src/constants';
import {ToolbarAction, ToolbarActionType} from './toolbar.actions';
import {ToolbarState} from './toolbar.model';


export const initialState: ToolbarState = {
    currentUser: getStoredUser(),
    isDarkMode: localStorage.getItem('user-theme') === Theme.Dark,
    isLoaded: false,
    isLockedLayout: localStorage.getItem('layout') !== 'unlocked',
    language: (localStorage.getItem('language') ?? 'English') as Language,
    lastRound: 0,
    page: Page.FullResults,
    playersResults: [],
};


export function toolbarReducer(state: ToolbarState = initialState, action: ToolbarAction): ToolbarState {
    switch (action.type) {
        case ToolbarActionType.SET_LANGUAGE:
            return {...state, language: action.payload.language};

        case ToolbarActionType.LOAD_PLAYERS_RESULTS:
            return {...state, isLoaded: false};

        case ToolbarActionType.SET_CURRENT_USER:
            return {...state, currentUser: action.payload.currentUser};

        case ToolbarActionType.SET_DARK_MODE:
            return {...state, isDarkMode: action.payload.isDarkMode};

        case ToolbarActionType.SET_LOCKED_LAYOUT:
            return {...state, isLockedLayout: action.payload.isLockedLayout};

        case ToolbarActionType.SET_LAST_ROUND_SUCCESS:
            return {...state, lastRound: action.payload.lastRound};
        
        case ToolbarActionType.SHOW_PAGE:
            return {...state, page: action.payload.page};

        case ToolbarActionType.LOAD_PLAYERS_RESULTS_SUCCESS:
            return {...state, playersResults: action.payload.playersResults, isLoaded: true};

        default:
            return state;
    }
}

function getStoredUser(): User|null {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return !!userJson ? JSON.parse(userJson) as User : null;
}
