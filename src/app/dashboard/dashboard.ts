import {ChangeDetectionStrategy, Component} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import {USER_DIALOG_OPTIONS} from 'src/constants';
import {Page} from '../enums'; 
import {getNextEvent} from '../common';
import {CreateAccountDialog} from '../toolbar/create-account-dialog/create-account-dialog';
import {LoginDialog} from '../toolbar/login-dialog/login-dialog';
import {ToolbarActionType} from '../toolbar/store/toolbar.actions';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly Page = Page;

  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly currentUser = this.store.select(toolbarSelectors.selectCurrentUser);
  readonly nextEvent = getNextEvent();
  readonly nextRaceRound = this.nextEvent.pipe(map(nextEvent => nextEvent.round));
  
  constructor(
    private readonly createAccountDialog: MatDialog,
    private readonly loginDialog: MatDialog,
    private readonly store: Store,
  ) {}

  showPage(page: Page): void {
    setTimeout(() => {
      this.store.dispatch({type: ToolbarActionType.SHOW_PAGE, payload: {page}});
    }, 100);
  }
  
  createAccount(): void {
    this.createAccountDialog.open(CreateAccountDialog, USER_DIALOG_OPTIONS);
  }

  login(): void {
    this.loginDialog.open(LoginDialog, USER_DIALOG_OPTIONS);
  }
}
