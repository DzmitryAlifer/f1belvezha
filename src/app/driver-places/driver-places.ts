import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {map} from 'rxjs/operators';
import {PREDICTION_PLACES_NUMBER} from 'src/constants';
import {NOT_SELECTED_DRIVER_NAME, NOT_SELECTED_DRIVER_POSITION} from '../common';
import {EventType} from '../enums';
import {F1PublicApiService} from '../service/f1-public-api.service';
import {ResultService} from '../service/result.service';
import {DriverRoundResult} from '../types';


const PLACE_INDEXES = Array.from({length: PREDICTION_PLACES_NUMBER}, (v, i) => i);
const CURRENT_YEAR = new Date().getFullYear();


@Component({
  selector: 'driver-places',
  templateUrl: './driver-places.html',
  styleUrls: ['./driver-places.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverPlacesComponent {
  @Input() round = 0;
  @Input() eventType = EventType.Qualification;

  readonly PLACE_INDEXES = PLACE_INDEXES;
  readonly EventType = EventType;
  
  readonly drivers = this.f1PublicApiService.getDriverStandings()
    .pipe(map(driverStandings => [...driverStandings, NOT_SELECTED_DRIVER_POSITION]));

  readonly roundResult = this.resultService.getDriverRoundResults(CURRENT_YEAR, this.round);
  
  readonly placesForm = new FormGroup({
    place1: new FormControl(''),
    place2: new FormControl(''),
    place3: new FormControl(''),
    place4: new FormControl(''),
    place5: new FormControl(''),
  });

  constructor(
    private readonly f1PublicApiService: F1PublicApiService,
    private readonly resultService: ResultService,
  ) {}

  getDriverFamilyName(driverRoundResult: DriverRoundResult|null|undefined, placeIndex: number): string {
    if (!driverRoundResult) {
      return NOT_SELECTED_DRIVER_NAME;
    }
    
    switch(this.eventType) {
      case EventType.Qualification:
        return driverRoundResult.qualifying[placeIndex];
      case EventType.Race:
        return driverRoundResult.race[placeIndex];
      default:
        return NOT_SELECTED_DRIVER_NAME;
    }
  }
}
