import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';


const PREDICTION_PLACES_NUMBER = 5;
const PLACE_INDEXES = Array.from({length: PREDICTION_PLACES_NUMBER}, (v, i) => i);

const PILOTS = [
  '[vacant]',
  'Max Verstappen',
  'Lewis Hamilton',
  'Valtteri Bottas',
  'Sergio Perez',
  'Carlos Sainz',
  'Lando Norris',
  'Charles Leclerc',
  'Daniel Ricciardo',
  'Pierre Gasly',
  'Fernando Alonso',
  'Esteban Ocon',
  'Sebastian Vettel',
  'Lance Stroll',
  'Yuki Tsunoda',
  'George Russell',
  'Kimi Räikkönen',
  'Nicholas Latifi',
  'Antonio Giovinazzi',
  'Mick Schumacher',
  'Nikita Mazepin',
];


@Component({
  selector: 'app-prediction-dialog',
  templateUrl: './prediction-dialog.html',
  styleUrls: ['./prediction-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PredictionDialog {
  readonly PLACE_INDEXES = PLACE_INDEXES;
  readonly PILOTS = PILOTS;
  
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
    private readonly formBuilder: FormBuilder,
  ) {}

  submit(): void {
    console.log(this.predictionForm.value);
    this.discard();
  }

  discard(): void {
    this.dialogRef.close();
  }
}
