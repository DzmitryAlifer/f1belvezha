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
}
