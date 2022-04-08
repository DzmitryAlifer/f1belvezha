import {Component, Inject} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {BehaviorSubject, combineLatest, merge} from 'rxjs';
import {filter, map, shareReplay} from 'rxjs/operators';
import {F1PublicApiService} from '../service/f1-public-api.service';
import {PredictionService} from '../service/prediction.service';
import {Prediction} from '../types';
import * as fullResultsSelectors from '../full-results/store/full-results.selectors';
import {FullResultsActionType} from '../full-results/store/full-results.actions';
import {DRIVER_TEAM_MAPPING, PREDICTION_PLACES_NUMBER, TEAM_NAMES} from 'src/constants';
import {CORRECT_TEAM_FROM_PAIR_PTS, getNextEvent, NOT_SELECTED_DRIVER_NAME, NOT_SELECTED_DRIVER_POSITION, WRONG_TEAM_PTS} from '../common';
import {TeamName} from '../enums';
import {EventType} from '../toolbar/next-event/next-event.component';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';


export interface PredictionDialogData {
  userId: number; 
  round: number, 
  hasPrediction: boolean;
  isQualificationLocked: boolean;
  isRaceLocked: boolean;
}


const PLACE_INDEXES = Array.from({length: PREDICTION_PLACES_NUMBER}, (v, i) => i);
const EMPTY_PREDICTION: Prediction = {
  qualification: [NOT_SELECTED_DRIVER_NAME, NOT_SELECTED_DRIVER_NAME, NOT_SELECTED_DRIVER_NAME, NOT_SELECTED_DRIVER_NAME, NOT_SELECTED_DRIVER_NAME], 
  race: [NOT_SELECTED_DRIVER_NAME, NOT_SELECTED_DRIVER_NAME, NOT_SELECTED_DRIVER_NAME, NOT_SELECTED_DRIVER_NAME, NOT_SELECTED_DRIVER_NAME], 
  team_vs_team: []
};


@Component({
  selector: 'app-prediction-dialog',
  templateUrl: './prediction-dialog.html',
  styleUrls: ['./prediction-dialog.scss'],
})
export class PredictionDialog {
  readonly PLACE_INDEXES = PLACE_INDEXES;
  readonly TEAM_NAMES = TEAM_NAMES;
  readonly NOT_SELECTED_DRIVER_NAME = NOT_SELECTED_DRIVER_NAME;
  readonly TeamName = TeamName;
  readonly teamSelectionTooltip = 
      `You can optionally select one winning team in each selection, or you can skip one or more selections.\n
      • Each correct selection: +${CORRECT_TEAM_FROM_PAIR_PTS} point.\n
      • Each incorrect selection: -${WRONG_TEAM_PTS} point.\n
      • Each skipped selection or selection with a draw: 0 points.`;

  private readonly selectedTeamsSubject = new BehaviorSubject<TeamName[]>([TeamName.None, TeamName.None]);
  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly drivers = this.f1PublicApiService.getDriverStandings()
    .pipe(map(driverStandings => [...driverStandings, NOT_SELECTED_DRIVER_POSITION]));
  readonly teamVsTeamProposals = this.store.select(fullResultsSelectors.selectNextRaceTeamVsTeamProposals);

  readonly prediction = this.store.select(fullResultsSelectors.selectCurrentUserPredictions).pipe(
    map(predictions => 
        predictions.find(({userid, round}) => userid == this.data.userId && round === this.data.round) ?? 
            EMPTY_PREDICTION),
    map(prediction => ({
      ...prediction,
      qualification: [...prediction.qualification],
      race: [...prediction.race],
      teamVsTeam: [...(prediction.team_vs_team ?? [])],
    })),
    shareReplay(1),
  );

  readonly selectedTeams = merge(
    this.prediction.pipe(map(({teamVsTeam}) => teamVsTeam)),
    this.selectedTeamsSubject,
  ).pipe(map(selectedTeams => [...selectedTeams]));
  
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
    teamVsTeam0: new FormControl(TeamName.None),
    teamVsTeam1: new FormControl(TeamName.None),
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

    combineLatest([this.prediction, this.selectedTeamsSubject]).subscribe(([prediction, selectedTeams]) => {
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
        teamVsTeam0: selectedTeams[0],
        teamVsTeam1: selectedTeams[1],
      });
    });
  }

  getBolidPath(driverFamilyName: string): string {
    const teamId = DRIVER_TEAM_MAPPING.get(driverFamilyName);
    return `/assets/images/bolids/${teamId}.png`;
  }

  asTeamName(teamName: any): string {
    return (teamName as TeamName).toString();
  }

  submit(): void {
    const {q1, q2, q3, q4, q5, r1, r2, r3, r4, r5, teamVsTeam0, teamVsTeam1} = this.predictionForm.value;
    const prediction: Prediction = {
      userid: this.data.userId,
      round: this.data.round,
      qualification: [q1, q2, q3, q4, q5],
      race: [r1, r2, r3, r4, r5],
      team_vs_team: [teamVsTeam0, teamVsTeam1],
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
  ].filter(name => !!name && name !== NOT_SELECTED_DRIVER_NAME);

  return filledNames.length === new Set(filledNames).size
}
