import {Action} from '@ngrx/store';


export enum FullResultsActionType {
    SET_LOADED = '[Full Results] Set loaded state',
    ACTION_2 = '[Full Results] Action 2',
}

export class SetLoaded implements Action {
    readonly type = FullResultsActionType.SET_LOADED;
    constructor(readonly payload: {isLoaded: boolean}) {}
}

export class Action2 implements Action {
    readonly type = FullResultsActionType.ACTION_2;
    constructor(readonly payload: {param2: string}) {}
}

export type FullResultsAction =
    | SetLoaded
    | Action2;
