import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
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
export class DriverPlacesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() round = 0;
  @Input() eventType = EventType.Qualification;
  @Input() results: string[] = [];
  @Output() selectedDrivers = new EventEmitter<string[]>();

  readonly PLACE_INDEXES = PLACE_INDEXES;
  readonly EventType = EventType;

  private readonly destroyed = new Subject<void>();
  
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

  ngOnInit(): void {
    this.placesForm.valueChanges.pipe(takeUntil(this.destroyed)).subscribe(formValues => {
      const driverNames = Object.values(formValues) as string[];
      this.selectedDrivers.emit(driverNames);
    });
  }

  ngOnChanges(): void {
    this.roundResult.pipe(takeUntil(this.destroyed)).subscribe(roundResult => {
      const eventResult = this.getEventResult(roundResult);

      this.placesForm.patchValue({
        place1: eventResult ? eventResult[0] : NOT_SELECTED_DRIVER_NAME,
        place2: eventResult ? eventResult[1] : NOT_SELECTED_DRIVER_NAME,
        place3: eventResult ? eventResult[2] : NOT_SELECTED_DRIVER_NAME,
        place4: eventResult ? eventResult[3] : NOT_SELECTED_DRIVER_NAME,
        place5: eventResult ? eventResult[4] : NOT_SELECTED_DRIVER_NAME,
      });
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private getEventResult(driverRoundResult: DriverRoundResult|undefined): string[]|null {
    if (!driverRoundResult) {
      return null;
    }

    switch (this.eventType) {
      case EventType.Qualification:
        return driverRoundResult.qualifying;
      case EventType.Race:
        return driverRoundResult.race;
      default:
        return [];
    }
  }

  getDriverFamilyName(driverRoundResult: DriverRoundResult|null|undefined, placeIndex: number): string {
    if (!driverRoundResult) {
      return NOT_SELECTED_DRIVER_NAME;
    }

    return this.getEventResult(driverRoundResult)![placeIndex];
  }
}
