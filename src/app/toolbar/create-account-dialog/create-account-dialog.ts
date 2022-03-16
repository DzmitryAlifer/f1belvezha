import {ChangeDetectionStrategy, Component} from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import { debounceTime, distinctUntilChanged, first, map} from 'rxjs/operators';
import {UserService} from 'src/app/service/user.service';
import {FullResultsActionType} from 'src/app/full-results/store/full-results.actions';
import * as fullResultsSelectors from 'src/app/full-results/store/full-results.selectors';
import {Observable } from 'rxjs';


// const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
const PASSWORD_REGEXP = /^.{8,24}$/;


@Component({
  selector: 'create-account-dialog1',
  templateUrl: './create-account-dialog.html',
  styleUrls: ['./create-account-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountDialog {
  readonly usernames = this.store.select(fullResultsSelectors.selectUsers).pipe(
    map(users => users.map(({username}) => username)));

  readonly accountForm = this.formBuilder.group({
    'firstname': [null, [Validators.required, Validators.maxLength(24)]],
    'lastname': [null, [Validators.maxLength(24)]],
    'username': [null, [Validators.required, Validators.minLength(6), Validators.maxLength(24)], this.verifyUsername()],
    'password': [null, [Validators.required, Validators.minLength(8), Validators.maxLength(24), this.verifyPassword]],
  });

  constructor(
    private readonly dialogRef: MatDialogRef<CreateAccountDialog>,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly userService: UserService,
  ) {}

  hasError(formControlName: string, errorName: string): boolean {
    return this.accountForm.get(formControlName)!.hasError(errorName);
  }

  private verifyUsername(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{[key: string]: any} | null> => {
      return this.usernames.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map(usernames => usernames.includes(control.value) ? ({'usernameExists': true}) : null),
        first(),
      );
    };
  }

  private verifyPassword(formControl: FormControl) {
    return (!PASSWORD_REGEXP.test(formControl.value) && formControl.value) ? {'requirements': true} : null;
  }

  submit(): void {
    this.cancel();
    this.userService.createUser(this.accountForm.value).subscribe(() => {
      this.store.dispatch({type: FullResultsActionType.LOAD_USERS});
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
