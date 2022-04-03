import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {delay} from 'rxjs/operators';
import {CURRENT_USER_KEY} from 'src/constants';
import {Language, Page} from '../enums';
import {FullResultsActionType} from '../full-results/store/full-results.actions';
import {LocalStorageService} from '../service/local-storage.service';
import {ThemeService} from '../service/theme.service';
import {CreateAccountDialog} from './create-account-dialog/create-account-dialog';
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
  readonly Page = Page;

  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly isLockedLayout = this.store.select(toolbarSelectors.selectIsLockedLayout).pipe(delay(200));
  readonly user = this.store.select(toolbarSelectors.selectCurrentUser);
  readonly page = this.store.select(toolbarSelectors.selectPage);
  readonly startPage = this.store.select(toolbarSelectors.selectStartPage);

  constructor(
    private readonly createAccountDialog: MatDialog,
    private readonly localStorageService: LocalStorageService,
    private readonly loginDialog: MatDialog,
    private readonly store: Store,
    private readonly themeService: ThemeService,
  ) {
    this.themeService.initTheme();
    localStorage.setItem('layout', 'locked');
    
    this.store.dispatch({type: FullResultsActionType.LOAD_USERS});
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

  toggleLayoutLock(wasLayoutLocked: boolean): void {
    this.store.dispatch({type: ToolbarActionType.SET_LOCKED_LAYOUT, payload: {isLockedLayout: !wasLayoutLocked}});
  }

  setStartPage(startPage: Page): void {
    this.store.dispatch({type: ToolbarActionType.SET_START_PAGE, payload: {startPage}});
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

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
