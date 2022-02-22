import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {merge} from 'rxjs';
import {CURRENT_USER_KEY} from 'src/constants';
import {BehaviorService} from '../service/behavior.service';
import {LocalStorageService} from '../service/local-storage.service';
import {UserService} from '../service/user.service';
import {CreateAccountDialog} from './create-account-dialog/create-account-dialog';
import {LoginDialog} from './login-dialog/login-dialog';


@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  readonly user = merge(
    this.behaviorService.getCurrentUser(), 
    this.userService.getCurrentUser(),
    );

  constructor(
    private readonly behaviorService: BehaviorService,
    private readonly createAccountDialog: MatDialog,
    private readonly localStorageService: LocalStorageService,
    private readonly loginDialog: MatDialog,
    private readonly userService: UserService,
  ) {}

  createAccount(): void {
    this.createAccountDialog.open(CreateAccountDialog, {disableClose: true});
  }

  login(): void {
    this.loginDialog.open(LoginDialog, {disableClose: true});
  }

  logout(): void {
    this.behaviorService.setCurrentUser(null);
    this.localStorageService.setItem(CURRENT_USER_KEY, null);
  }
}
