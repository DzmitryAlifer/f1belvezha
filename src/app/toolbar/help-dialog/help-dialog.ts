import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {DRIVER_IN_LIST_PTS, DRIVER_PLACE_PTS} from '../../common';


@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.html',
  styleUrls: ['./help-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpDialog {
  readonly DRIVER_IN_LIST_PTS = DRIVER_IN_LIST_PTS;
  readonly DRIVER_PLACE_PTS = DRIVER_PLACE_PTS;
  
  constructor(private readonly dialogRef: MatDialogRef<HelpDialog>) {}

  close(): void {
    this.dialogRef.close();
  }
}
