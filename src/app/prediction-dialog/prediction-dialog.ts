import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {combineLatest} from 'rxjs';
import {map, shareReplay, startWith, tap} from 'rxjs/operators';
import {F1PublicApiService} from '../service/f1-public-api.service';
import {PredictionService} from '../service/prediction.service';
import {Places, Prediction} from '../types';


export const PREDICTION_PLACES_NUMBER = 5;
const PLACE_INDEXES = Array.from({length: PREDICTION_PLACES_NUMBER}, (v, i) => i);

const DRIVER_TEAM_MAPPING = new Map<string, string>()
    .set('Hamilton', 'mercedes')
    .set('Russell', 'mercedes')
    .set('Verstappen', 'red_bull')
    .set('Pérez', 'red_bull')
    .set('Sainz', 'ferrari')
    .set('Leclerc', 'ferrari')
    .set('Norris', 'mclaren')
    .set('Ricciardo', 'mclaren')
    .set('Ocon', 'alpine')
    .set('Alonso', 'alpine')
    .set('Gasly', 'alphatauri')
    .set('Tsunoda', 'alphatauri')
    .set('Stroll', 'aston_martin')
    .set('Vettel', 'aston_martin')
    .set('Albon', 'williams')
    .set('Latifi', 'williams')
    .set('Bottas', 'alfa')
    .set('Zhou', 'alfa')
    .set('Schumacher', 'haas')    
    .set('Mazepin', 'haas');


@Component({
  selector: 'app-prediction-dialog',
  templateUrl: './prediction-dialog.html',
  styleUrls: ['./prediction-dialog.scss'],
})
export class PredictionDialog {
  readonly PLACE_INDEXES = PLACE_INDEXES;

  readonly drivers = this.f1PublicApiService.getDrivers();
  readonly existingPrediction = this.predictionService.getPrediction(this.data.userId, this.data.round);
  readonly isLoaded = combineLatest([this.drivers, this.existingPrediction])
    .pipe(map(([drivers, prediction]) => !!drivers && !!prediction));

  readonly places = this.existingPrediction.pipe(
    startWith({qualification: ['', '', '', '', ''], race: ['', '', '', '', '']}),
    shareReplay(1),
  );
  
  readonly predictionForm = this.formBuilder.group({
    q1: [''],
    q2: [''],
    q3: [''],
    q4: [''],
    q5: [''],
    r1: [''],
    r2: [''],
    r3: [''],
    r4: [''],
    r5: [''],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {userId: number; round: number},
    private readonly dialogRef: MatDialogRef<PredictionDialog>,
    private readonly f1PublicApiService: F1PublicApiService,
    private readonly formBuilder: FormBuilder,
    private readonly predictionService: PredictionService,
  ) {
    this.places.subscribe(places => {
      this.predictionForm.patchValue({
        q1: places.qualification[0],
        q2: places.qualification[1],
        q3: places.qualification[2],
        q4: places.qualification[3],
        q5: places.qualification[4],
        r1: places.race[0],
        r2: places.race[1],
        r3: places.race[2],
        r4: places.race[3],
        r5: places.race[4],
     });
    });
  }

  getBolidPath(driverFamilyName: string): string {
    const teamId = DRIVER_TEAM_MAPPING.get(driverFamilyName);
    return `/assets/images/bolids/${teamId}.png`;
  }

  submit(): void {
    const {q1, q2, q3, q4, q5, r1, r2, r3, r4, r5} = this.predictionForm.value;
    const prediction: Prediction = {
      userid: this.data.userId,
      round: this.data.round,
      qualification: [q1, q2, q3, q4, q5],
      race: [r1, r2, r3, r4, r5],
    };
    this.predictionService.makePrediction(prediction).subscribe();
    this.dialogRef.close();
  }

  discard(): void {
    this.dialogRef.close();
  }
}
