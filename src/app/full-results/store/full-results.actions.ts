import {Action} from '@ngrx/store';
import {User} from 'src/app/types';


export enum FullResultsActionType {
    SET_LOADED = '[Full Results] Set loaded state',
    LOAD_USERS = '[Full Results] Load users',
    LOAD_USERS_SUCCESS = '[Full Results] Load users - success',
}

export class SetLoaded implements Action {
    readonly type = FullResultsActionType.SET_LOADED;
    constructor(readonly payload: {isLoaded: boolean}) {}
}

export class LoadUsers implements Action {
    readonly type = FullResultsActionType.LOAD_USERS;
    constructor(readonly payload: {param2: string}) {}
}

export class LoadUsersSuccess implements Action {
    readonly type = FullResultsActionType.LOAD_USERS_SUCCESS;
    constructor(readonly payload: {users: User[]}) {}
}

export type FullResultsAction =
    | SetLoaded
    | LoadUsers
    | LoadUsersSuccess;
