import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CreateAccountDialog} from './create-account-dialog/create-account-dialog';


@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  isAuthorized = false;

  constructor(private readonly createAccountDialog: MatDialog) {}

  openMainMenu() {

  }

  openSettingsMenu() {
    
  }

  login() {
    
  }

  createAccount() {
    this.createAccountDialog.open(CreateAccountDialog, {disableClose: true});
  }
}
