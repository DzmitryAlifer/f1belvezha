import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {UserService} from 'src/app/service/user.service';
import {BehaviorService} from 'src/app/service/behavior.service';
import {LocalStorageService} from 'src/app/service/local-storage.service';
import {CURRENT_USER_KEY} from 'src/constants';


@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.html',
  styleUrls: ['./login-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginDialog {
  readonly loginForm = this.formBuilder.group({
    'username': [null, [Validators.required]],
    'password': [null, [Validators.required]],
  });

  constructor(
    private readonly behaviorService: BehaviorService,
    private readonly dialogRef: MatDialogRef<LoginDialog>,
    private readonly formBuilder: FormBuilder,
    private readonly localStorageService: LocalStorageService,
    private readonly userService: UserService,
  ) {}

  login(): void {
    this.userService.login(this.loginForm.value).subscribe(user => {
      this.behaviorService.setCurrentUser(user);
      this.localStorageService.setItem(CURRENT_USER_KEY, user);
    });
    
    this.cancel();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
