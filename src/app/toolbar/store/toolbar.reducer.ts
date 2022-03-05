import { ToolbarAction, ToolbarActionType} from './toolbar.actions';
import {ToolbarState} from './toolbar.model';


export const initialState: ToolbarState = {
    currentUser: null,
    isDarkMode: false,
};


export function toolbarReducer(state: ToolbarState = initialState, action: ToolbarAction): ToolbarState {
    switch (action.type) {
        case ToolbarActionType.SET_CURRENT_USER:
            return { ...state, currentUser: action.payload.currentUser};

        default:
            return state;
    }
}
