import {Component, Inject} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {map, shareReplay} from 'rxjs/operators';
import {F1PublicApiService} from '../service/f1-public-api.service';
import {PredictionService} from '../service/prediction.service';
import {Places, Prediction} from '../types';


const PREDICTION_PLACES_NUMBER = 5;
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
  readonly selectedDriverFamilyNames = [['','','','',''], ['','','','','']];
  readonly PLACE_INDEXES = PLACE_INDEXES;

  readonly existingPrediction = this.predictionService.getPrediction(this.data.userId, this.data.round)
      .pipe(shareReplay(1));

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
    @Inject(MAT_DIALOG_DATA) public data: {userId: number; round: number},
    private readonly dialogRef: MatDialogRef<PredictionDialog>,
    private readonly f1PublicApiService: F1PublicApiService,
    private readonly formBuilder: FormBuilder,
    private readonly predictionService: PredictionService,
  ) {
    // TODO: remake this ugly logic and get ChangeDetectionStrategy.OnPush back
    this.existingPrediction.pipe(map(prediction => prediction.places)).subscribe((places: Places) => {
      this.selectedDriverFamilyNames[0][0] = places.qualification1;
      this.selectedDriverFamilyNames[0][1] = places.qualification2;
      this.selectedDriverFamilyNames[0][2] = places.qualification3;
      this.selectedDriverFamilyNames[0][3] = places.qualification4;
      this.selectedDriverFamilyNames[0][4] = places.qualification5;
      this.selectedDriverFamilyNames[1][0] = places.race1;
      this.selectedDriverFamilyNames[1][1] = places.race2;
      this.selectedDriverFamilyNames[1][2] = places.race3;
      this.selectedDriverFamilyNames[1][3] = places.race4;
      this.selectedDriverFamilyNames[1][4] = places.race5;
    });
  }

  getPilotName(prediction: Prediction | null, eventName: string, place: number): string {
    if (!prediction || !prediction.places) {
      return '';
    }

    return prediction.places[eventName + place];
  }

  getBolidPath(driverFamilyName: string): string {
    const teamId = DRIVER_TEAM_MAPPING.get(driverFamilyName);
    return `/assets/images/bolids/${teamId}.png`;
  }

  submit(): void {
    const prediction: Prediction = {
      userid: this.data.userId,
      round: this.data.round,
      places: this.predictionForm.value,
    };
    this.predictionService.makePrediction(prediction);
    this.dialogRef.close();
  }

  discard(): void {
    this.dialogRef.close();
  }
}
