import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {getCircuitPath} from '../common';


@Component({
  selector: 'app-circuit-dialog',
  templateUrl: './circuit-dialog.html',
  styleUrls: ['./circuit-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircuitDialog {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {raceName: string}) {}

  getLargeCircuitPath(countryName: string): string {
    return getCircuitPath(countryName, true);
  }
}
