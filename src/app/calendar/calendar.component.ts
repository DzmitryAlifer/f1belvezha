import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import {formatDate, formatDateTime, getCircuitPath, getFlagLink, getNextEvent} from '../common';
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
  readonly nextRaceRound = getNextEvent().pipe(map(nextEvent => nextEvent.round));

  constructor(private readonly store: Store) {this.races.subscribe(p=>console.log(p))}

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
}
