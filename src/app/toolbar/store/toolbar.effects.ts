import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {map, switchMap, tap} from 'rxjs/operators';
import {Theme, ThemeService} from 'src/app/service/theme.service';
import {ToolbarAction, ToolbarActionType} from './toolbar.actions';
import * as toolbarSelectors from './toolbar.selectors';


@Injectable()
export class ToolbarEffects {
    private readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
    private readonly isLockedLayout = this.store.select(toolbarSelectors.selectIsLockedLayout);

    constructor(
        private actions: Actions<ToolbarAction>,
        private readonly store: Store,
        private themeService: ThemeService,
    ) {}

    setTheme = createEffect(() => this.actions.pipe(
        ofType(ToolbarActionType.SET_DARK_MODE),
        switchMap(() => this.isDarkMode.pipe(
            tap(isDarkMode => {
                this.themeService.update(isDarkMode ? Theme.Dark : Theme.Light);
            }),
            map(() => ({type: ToolbarActionType.SET_DARK_MODE_SUCCESS})),
        )),
    ));

    setLockedLayout = createEffect(() => this.actions.pipe(
        ofType(ToolbarActionType.SET_LOCKED_LAYOUT),
        switchMap(() => this.isLockedLayout.pipe(
            tap(isLockedLayout => {
                localStorage.setItem('layout', isLockedLayout ? 'locked' : 'unlocked');
            }),
            map(() => ({type: ToolbarActionType.SET_LOCKED_LAYOUT_SUCCESS})),
        )),
    ));
}
