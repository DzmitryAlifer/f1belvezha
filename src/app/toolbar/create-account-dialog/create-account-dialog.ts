import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {UserService} from 'src/app/service/user.service';
import {BehaviorService} from 'src/app/service/behavior.service';


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
    private readonly behaviorService: BehaviorService,
    private readonly dialogRef: MatDialogRef<CreateAccountDialog>,
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
  ) {}

  checkPassword(formControl: FormControl) {
    return (!PASSWORD_REGEXP.test(formControl.value) && formControl.value) ? { 'requirements': true } : null;
  }

  submit(): void {
    this.userService.createUser(this.accountForm.value).subscribe();
    this.cancel();
    this.behaviorService.reloadUsers();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}