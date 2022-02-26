import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.html',
  styleUrls: ['./help-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpDialog {
  constructor(private readonly dialogRef: MatDialogRef<HelpDialog>) {}

  close(): void {
    this.dialogRef.close();
  }
}
