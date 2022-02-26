import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import { F1PublicApiService } from '../service/f1-public-api.service';


const PREDICTION_PLACES_NUMBER = 5;
const PLACE_INDEXES = Array.from({length: PREDICTION_PLACES_NUMBER}, (v, i) => i);

const DRIVER_TEAM_MAPPING = new Map<string, string>()
    .set('hamilton', 'mercedes')
    .set('russell', 'mercedes')
    .set('max_verstappen', 'red_bull')
    .set('perez', 'red_bull')
    .set('sainz', 'ferrari')
    .set('leclerc', 'ferrari')
    .set('norris', 'mclaren')
    .set('ricciardo', 'mclaren')
    .set('ocon', 'alpine')
    .set('alonso', 'alpine')
    .set('gasly', 'alphatauri')
    .set('tsunoda', 'alphatauri')
    .set('stroll', 'aston_martin')
    .set('vettel', 'aston_martin')
    .set('albon', 'williams')
    .set('latifi', 'williams')
    .set('bottas', 'alfa')
    .set('zhou', 'alfa')
    .set('mick_schumacher', 'haas')    
    .set('mazepin', 'haas');


@Component({
  selector: 'app-prediction-dialog',
  templateUrl: './prediction-dialog.html',
  styleUrls: ['./prediction-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredictionDialog {
  readonly selectedDriverIds = [['','','','',''],['','','','','']];
  readonly PLACE_INDEXES = PLACE_INDEXES;
  readonly drivers = this.f1PublicApiService.getDrivers();
  
  readonly predictionForm = this.formBuilder.group({
    qualification1: [null],
    qualification2: [null],
    qualification3: [null],
    qualification4: [null],
    qualification5: [null],
    race1: [null],
    race2: [null],
    race3: [null],
    race4: [null],
    race5: [null],
  });

  constructor(
    private readonly dialogRef: MatDialogRef<PredictionDialog>,
    private readonly f1PublicApiService: F1PublicApiService,
    private readonly formBuilder: FormBuilder,
  ) {}

  getBolidPath(driverId: string): string {
    const teamId = DRIVER_TEAM_MAPPING.get(driverId);
    return `/assets/images/bolids/${teamId}.png`;
  }

  submit(): void {
    console.log(this.predictionForm.value);
    this.discard();
  }

  discard(): void {
    this.dialogRef.close();
  }
}
