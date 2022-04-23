import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {map, switchMap} from 'rxjs/operators';
import {CircuitDialog} from '../circuit-dialog/circuit-dialog';
import {formatDate, formatDateTime, getCircuitPath, getFlagLink, getNextEvent2} from '../common';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';
import {DateTimeApi} from '../types';


@Component({
  selector: 'calendar',
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  readonly displayedColumns = [
    'round',
    'raceDate',
    'country',
    'circuit',
    'grandPrix',
    'practice1',
    'practice2',
    'practice3',
    'qualifying',
    'sprint',
    'race',
  ];

  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly races = this.store.select(toolbarSelectors.selectCalendar);
  
  readonly nextRaceRound = this.races.pipe(
    switchMap(allEvents => getNextEvent2(allEvents)),
    map(nextEvent => nextEvent.round),
  );
  // readonly nextRaceRound = getNextEvent().pipe(map(nextEvent => nextEvent.round));

  constructor(
    private readonly circuitDialog: MatDialog,
    private readonly store: Store,
  ) {}

  formatDate(dateStr: string): string {
    return formatDate(dateStr);
  }

  formatDateTime(dateTime: DateTimeApi): string {
    return formatDateTime(dateTime);
  }

  getFlagLink(countryName: string): string {
    return getFlagLink(countryName);
  }

  getCircuitPath(countryName: string): string {
    return getCircuitPath(countryName);
  }

  showCircuitDialog(raceName: string): void {
    this.circuitDialog.open(CircuitDialog, {data: {raceName}});
  }
}
