import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {BehaviorService} from '../service/behavior.service';
import {CreateAccountDialog} from './create-account-dialog/create-account-dialog';
import {LoginDialog} from './login-dialog/login-dialog';


@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  readonly user = this.behaviorService.getCurrentUser();

  constructor(
    private readonly createAccountDialog: MatDialog,
    private readonly loginDialog: MatDialog,
    private readonly behaviorService: BehaviorService,
  ) {}

  createAccount(): void {
    this.createAccountDialog.open(CreateAccountDialog, {disableClose: true});
  }

  login(): void {
    this.loginDialog.open(LoginDialog, {disableClose: true});
  }
}
