import {Action} from '@ngrx/store';
import {User} from 'src/app/types';


export enum ToolbarActionType {
    SET_CURRENT_USER = '[Toolbar] Set current user',
}

export class SetCurrentUser implements Action {
    readonly type = ToolbarActionType.SET_CURRENT_USER;
    constructor(readonly payload: {currentUser: User}) {}
}

export type ToolbarAction =
    | SetCurrentUser;
