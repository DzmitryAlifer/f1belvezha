import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {delay} from 'rxjs/operators';
import {CURRENT_USER_KEY} from 'src/constants';
import {Language} from '../enums';
import {LocalStorageService} from '../service/local-storage.service';
import {ThemeService} from '../service/theme.service';
import {CreateAccountDialog} from './create-account-dialog/create-account-dialog';
import {HelpDialog} from './help-dialog/help-dialog';
import {LoginDialog} from './login-dialog/login-dialog';
import {ToolbarActionType} from './store/toolbar.actions';
import * as toolbarSelectors from './store/toolbar.selectors';


@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  readonly Language = Language;

  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly isLockedLayout = this.store.select(toolbarSelectors.selectIsLockedLayout).pipe(delay(200));
  readonly user = this.store.select(toolbarSelectors.selectCurrentUser);
  readonly page = this.store.select(toolbarSelectors.selectPage);

  constructor(
    private readonly createAccountDialog: MatDialog,
    private readonly helpDialog: MatDialog,
    private readonly localStorageService: LocalStorageService,
    private readonly loginDialog: MatDialog,
    private readonly store: Store,
    private readonly themeService: ThemeService,
  ) {
    this.themeService.initTheme();
    localStorage.setItem('layout', 'locked');
    this.store.dispatch({type: ToolbarActionType.LOAD_PLAYERS_RESULTS}); 
    this.store.dispatch({type: ToolbarActionType.LOAD_CALENDAR}); 
    this.store.dispatch({type: ToolbarActionType.SET_LAST_ROUND}); 
  }

  createAccount(): void {
    this.createAccountDialog.open(CreateAccountDialog, {disableClose: true, width: '270px'});
  }

  login(): void {
    this.loginDialog.open(LoginDialog, {disableClose: true, width: '270px'});
  }

  logout(): void {
    this.store.dispatch({type: ToolbarActionType.SET_CURRENT_USER, payload: {currentUser: null}});
    this.localStorageService.setItem(CURRENT_USER_KEY, null);
  }

  changeAvatar(): void {}

  toggleMode(isPrevousModeDark: boolean) {
    this.store.dispatch({type: ToolbarActionType.SET_DARK_MODE, payload: {isDarkMode: !isPrevousModeDark}});
  }

  showHelp(): void {
    this.helpDialog.open(HelpDialog, {width: '60%'});
  }

  toggleLayoutLock(wasLayoutLocked: boolean): void {
    this.store.dispatch({type: ToolbarActionType.SET_LOCKED_LAYOUT, payload: {isLockedLayout: !wasLayoutLocked}});
  }

  // For testing purposes
  setLanguage(language: Language): void {
    if (language === Language.English) {
      setTimeout(() => {
        this.store.dispatch({type: ToolbarActionType.SET_LANGUAGE, payload: {language}});
      }, 3000);
    }

    if (language === Language.Russian) {
      setTimeout(() => {
        this.store.dispatch({type: ToolbarActionType.SET_LANGUAGE, payload: {language}});
      }, 5000);
    }
  }
}
