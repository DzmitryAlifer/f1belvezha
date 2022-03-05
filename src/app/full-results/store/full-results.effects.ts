import {Injectable } from '@angular/core';
import {Actions, createEffect, ofType } from '@ngrx/effects';
import {map, switchMap} from 'rxjs/operators';
import {UserService} from '../../service/user.service';
import {FullResultsAction, FullResultsActionType} from './full-results.actions';


@Injectable()
export class FullResultsEffects {
    private readonly users = this.userService.getAllUsers();

    constructor(
        private actions: Actions<FullResultsAction>,
        private userService: UserService,
    ) {}

    loadUsers = createEffect(() => this.actions.pipe(
        ofType(FullResultsActionType.LOAD_USERS),
        switchMap(() => this.users.pipe(
            map(users => ({type: FullResultsActionType.LOAD_USERS_SUCCESS, payload: {users}})),
        ))
    ));
}
