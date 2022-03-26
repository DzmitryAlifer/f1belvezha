import {Component, Inject} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {combineLatest, ReplaySubject} from 'rxjs';
import {filter, map, shareReplay} from 'rxjs/operators';
import {F1PublicApiService} from '../service/f1-public-api.service';
import {PredictionService} from '../service/prediction.service';
import {Prediction} from '../types';
import * as fullResultsSelectors from '../full-results/store/full-results.selectors';
import {FullResultsActionType} from '../full-results/store/full-results.actions';
import {DRIVER_TEAM_MAPPING, PREDICTION_PLACES_NUMBER} from 'src/constants';
import {getNextEvent} from '../common';
import {EventType} from '../toolbar/next-event/next-event.component';


export interface PredictionDialogData {
  userId: number; 
  round: number, 
  hasPrediction: boolean;
  isQualificationLocked: boolean;
  isRaceLocked: boolean;
}


const PLACE_INDEXES = Array.from({length: PREDICTION_PLACES_NUMBER}, (v, i) => i);
const EMPTY_PREDICTION: Prediction = {qualification: ['', '', '', '', ''], race: ['', '', '', '', ''], teamVsTeam: []};


@Component({
  selector: 'app-prediction-dialog',
  templateUrl: './prediction-dialog.html',
  styleUrls: ['./prediction-dialog.scss'],
})
export class PredictionDialog {
  readonly PLACE_INDEXES = PLACE_INDEXES;
  readonly raceSelectedName = new ReplaySubject<string>();
  readonly drivers = this.f1PublicApiService.getDriverStandings();
  readonly teamVsTeamProposals = this.store.select(fullResultsSelectors.selectNextRaceTeamVsTeamProposals);

  readonly prediction = this.store.select(fullResultsSelectors.selectCurrentUserPredictions).pipe(
    map(predictions => 
        predictions.find(({userid, round}) => userid == this.data.userId && round === this.data.round) ?? 
            EMPTY_PREDICTION),
    map(prediction => ({
      ...prediction,
      qualification: [...prediction.qualification],
      race: [...prediction.race],
      teamVsTeam: [...(prediction.teamVsTeam ?? [])],
    })),
    shareReplay(1),
  );
  
  readonly isLoaded = combineLatest([this.drivers, this.prediction])
    .pipe(map(([drivers, prediction]) => !!drivers && !!prediction));
  
  readonly predictionForm = new FormGroup({
    q1: defineField(this.data.isQualificationLocked),
    q2: defineField(this.data.isQualificationLocked),
    q3: defineField(this.data.isQualificationLocked),
    q4: defineField(this.data.isQualificationLocked),
    q5: defineField(this.data.isQualificationLocked),
    r1: defineField(this.data.isRaceLocked),
    r2: defineField(this.data.isRaceLocked),
    r3: defineField(this.data.isRaceLocked),
    r4: defineField(this.data.isRaceLocked),
    r5: defineField(this.data.isRaceLocked),
  }, {validators: validateForm});

  private readonly nextEvent = getNextEvent().pipe(
    filter(event => event.round === this.data.round),
    shareReplay(1));
  readonly isQualificationEditable = this.nextEvent.pipe(
    map(event => event.eventType === EventType.Qualification && !!event.start));
  readonly isRaceEditable = combineLatest([this.nextEvent, this.isQualificationEditable]).pipe(
    map(([event, isQualificationEditable]) => 
      isQualificationEditable || 
      event.eventType === EventType.Qualification && !!event.end ||
      event.eventType === EventType.Race && !!event.start));

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PredictionDialogData,
    private readonly dialogRef: MatDialogRef<PredictionDialog>,
    private readonly f1PublicApiService: F1PublicApiService,
    private readonly predictionService: PredictionService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.store.dispatch({type: FullResultsActionType.LOAD_CURRENT_USER_PREDICTIONS});

    this.prediction.subscribe(prediction => {
      this.predictionForm.patchValue({
        q1: prediction.qualification[0],
        q2: prediction.qualification[1],
        q3: prediction.qualification[2],
        q4: prediction.qualification[3],
        q5: prediction.qualification[4],
        r1: prediction.race[0],
        r2: prediction.race[1],
        r3: prediction.race[2],
        r4: prediction.race[3],
        r5: prediction.race[4],
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
      teamVsTeam: [],
    };
    const predictionResponse = this.data.hasPrediction ? 
        this.predictionService.updatePrediction(prediction) :
        this.predictionService.makePrediction(prediction);
    predictionResponse.subscribe(() => {
      this.store.dispatch({type: FullResultsActionType.LOAD_ALL_PREDICTIONS});
    });
    this.dialogRef.close();
  }

  discard(): void {
    this.dialogRef.close();
  }
}

function defineField(isEventLocked: boolean): FormControl {
  return isEventLocked ? new FormControl('') : new FormControl('', Validators.required);
}

function validateForm(control: AbstractControl): ValidationErrors | null {
  const qualificationDriversNotUnique = !areFilledNamesUnique(control, 'q');
  const raceDriversNotUnique = !areFilledNamesUnique(control, 'r')

  return qualificationDriversNotUnique || raceDriversNotUnique ?
      {qualificationDriversNotUnique, raceDriversNotUnique} :
      null;
}

function areFilledNamesUnique(control: AbstractControl, controlPrefix: 'q' | 'r'): boolean {
  const filledNames = [
    control.get(controlPrefix + 1)?.value,
    control.get(controlPrefix + 2)?.value,
    control.get(controlPrefix + 3)?.value,
    control.get(controlPrefix + 4)?.value,
    control.get(controlPrefix + 5)?.value,
  ].filter(name => !!name);

  return filledNames.length === new Set(filledNames).size
}
