import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {UserService} from 'src/app/service/user.service';
import {FullResultsActionType} from 'src/app/full-results/store/full-results.actions';


// const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
const PASSWORD_REGEXP = /^.{1,32}$/;


@Component({
  selector: 'create-account-dialog1',
  templateUrl: './create-account-dialog.html',
  styleUrls: ['./create-account-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountDialog {
  readonly accountForm = this.formBuilder.group({
    'firstname': [null, [Validators.required]],
    'lastname': [null],
    'username': [null, [Validators.required]],
    'password': [null, [Validators.required, this.checkPassword]],
  });

  constructor(
    private readonly dialogRef: MatDialogRef<CreateAccountDialog>,
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly userService: UserService,
  ) {}

  checkPassword(formControl: FormControl) {
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
