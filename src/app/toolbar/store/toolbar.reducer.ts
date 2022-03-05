import { Theme } from 'src/app/service/theme.service';
import { ToolbarAction, ToolbarActionType} from './toolbar.actions';
import {ToolbarState} from './toolbar.model';


export const initialState: ToolbarState = {
    currentUser: null,
    isDarkMode: localStorage.getItem('user-theme') === Theme.Dark,
};


export function toolbarReducer(state: ToolbarState = initialState, action: ToolbarAction): ToolbarState {
    switch (action.type) {
        case ToolbarActionType.SET_CURRENT_USER:
            return {...state, currentUser: action.payload.currentUser};

        case ToolbarActionType.SET_DARK_MODE:
            return {...state, isDarkMode: action.payload.isDarkMode};

        default:
            return state;
    }
}
