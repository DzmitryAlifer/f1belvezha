import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import * as fullResultsSelectors from 'src/app/full-results/store/full-results.selectors';
import {UserService} from 'src/app/service/user.service';
import {LocalStorageService} from 'src/app/service/local-storage.service';
import {CURRENT_USER_KEY} from 'src/constants';
import {ToolbarActionType} from '../store/toolbar.actions';
import { debounceTime, distinctUntilChanged, first, map, Observable } from 'rxjs';


@Component({
  templateUrl: './login-dialog.html',
  styleUrls: ['./login-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginDialog {
  readonly usernames = this.store.select(fullResultsSelectors.selectUsernames);

  readonly loginForm = this.formBuilder.group({
    'username': [null, [Validators.required], this.verifyUsername()],
    'password': [null, [Validators.required]],
  });

  constructor(
    private readonly dialogRef: MatDialogRef<LoginDialog>,
    private readonly formBuilder: FormBuilder,
    private readonly localStorageService: LocalStorageService,
    private readonly store: Store,
    private readonly userService: UserService,
  ) {}

  hasError(formControlName: string, errorName: string): boolean {
    return this.loginForm.get(formControlName)!.hasError(errorName);
  }

  private verifyUsername(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{[key: string]: any} | null> => {
      return this.usernames.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map(usernames => !usernames.includes(control.value) ? ({'usernameNotExist': true}) : null),
        first(),
      );
    };
  }

  login(): void {
    this.userService.login(this.loginForm.value).subscribe(currentUser => {
      this.store.dispatch({type: ToolbarActionType.SET_CURRENT_USER, payload: {currentUser}});
      this.localStorageService.setItem(CURRENT_USER_KEY, currentUser);
    });
    
    this.cancel();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
