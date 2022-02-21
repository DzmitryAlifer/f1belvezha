import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';


const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

@Component({
  selector: 'create-account-dialog1',
  templateUrl: './create-account-dialog.html',
  styleUrls: ['./create-account-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAccountDialog {
  readonly accountForm = this.formBuilder.group({
    'firstName': [null, [Validators.required]],
    'lastName': [null],
    'login': [null, [Validators.required]],
    'password': [null, [Validators.required, this.checkPassword]],
  });

  post: any = '';

  constructor(
    private readonly dialogRef: MatDialogRef<CreateAccountDialog>,
    private readonly formBuilder: FormBuilder,
  ) {}

  checkPassword(formControl: FormControl) {
    return (!PASSWORD_REGEXP.test(formControl.value) && formControl.value) ? { 'requirements': true } : null;
  }

  submit(): void {
    this.post = this.accountForm.value;
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
