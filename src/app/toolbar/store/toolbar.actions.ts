import {Action} from '@ngrx/store';
import {User} from 'src/app/types';


export enum ToolbarActionType {
    SET_CURRENT_USER = '[Toolbar] Set current user',
    SET_DARK_MODE = '[Toolbar] Set dark mode',
    SET_DARK_MODE_SUCCESS = '[Toolbar] Set dark mode - success',
}

export class SetCurrentUser implements Action {
    readonly type = ToolbarActionType.SET_CURRENT_USER;
    constructor(readonly payload: {currentUser: User}) {}
}

export class SetDarkMode implements Action {
    readonly type = ToolbarActionType.SET_DARK_MODE;
    constructor(readonly payload: {isDarkMode: boolean}) {}
}

export type ToolbarAction =
    | SetCurrentUser
    | SetDarkMode;
