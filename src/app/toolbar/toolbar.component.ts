import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {merge} from 'rxjs';
import {startWith} from 'rxjs/operators';
import {CURRENT_USER_KEY} from 'src/constants';
import {LocalStorageService} from '../service/local-storage.service';
import {UserService} from '../service/user.service';
import {Theme, ThemeService} from '../service/theme.service';
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
  readonly isDarkMode = this.themeService.isDarkMode().pipe(
    startWith(localStorage.getItem('user-theme')),
  );

  readonly user = merge(
    this.store.select(toolbarSelectors.selectCurrentUser),
    this.userService.getCurrentUser(),
  );

  constructor(
    private readonly createAccountDialog: MatDialog,
    private readonly helpDialog: MatDialog,
    private readonly localStorageService: LocalStorageService,
    private readonly loginDialog: MatDialog,
    private readonly store: Store,
    private readonly themeService: ThemeService,
    private readonly userService: UserService,
  ) {
    this.themeService.initTheme();
  }

  createAccount(): void {
    this.createAccountDialog.open(CreateAccountDialog, {disableClose: true});
  }

  login(): void {
    this.loginDialog.open(LoginDialog, {disableClose: true});
  }

  logout(): void {
    this.store.dispatch({type: ToolbarActionType.SET_CURRENT_USER, payload: {currentUser: null}});
    this.localStorageService.setItem(CURRENT_USER_KEY, null);
  }

  changeAvatar(): void {}

  toggleMode(isPrevousModeDark: boolean) {
    this.themeService.update(isPrevousModeDark ? Theme.Light : Theme.Dark);
  }

  showHelp(): void {
    this.helpDialog.open(HelpDialog, {width: '500px'});
  }
}
