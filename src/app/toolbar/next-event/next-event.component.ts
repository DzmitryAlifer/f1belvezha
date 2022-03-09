import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import * as moment from 'moment';
import {DateRange, EventSchedule} from 'src/app/types';
import * as toolbarSelectors from '../store/toolbar.selectors';


const NOW = moment();

const SCHEDULE: EventSchedule[] = [
    {
      location: 'Bahrain',
      practice1: {start: moment('2022-03-18T15:00:00'), end: moment('2022-03-18T16:00:00')},
      practice2: {start: moment('2022-03-18T18:00:00'), end: moment('2022-03-18T19:00:00')},
      practice3: {start: moment('2022-03-19T15:00:00'), end: moment('2022-03-19T16:00:00')},
      qualification: {start: moment('2022-03-19T18:00:00'), end: moment('2022-03-19T19:00:00')},
      race: {start: moment('2022-03-20T18:00:00'), end: moment('2022-03-20T20:00:00')},
    },
    {
      location: 'Saudi Arabia',
      practice1: {start: moment('2022-03-25T15:00:00'), end: moment('2022-03-25T16:00:00')},
      practice2: {start: moment('2022-03-25T18:00:00'), end: moment('2022-03-25T19:00:00')},
      practice3: {start: moment('2022-03-26T15:00:00'), end: moment('2022-03-26T16:00:00')},
      qualification: {start: moment('2022-03-26T18:00:00'), end: moment('2022-03-26T19:00:00')},
      race: {start: moment('2022-03-27T19:00:00'), end: moment('2022-03-27T21:00:00')},
    },
  ];


@Component({
  selector: 'next-event',
  templateUrl: './next-event.component.html',
  styleUrls: ['./next-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextEventComponent implements OnInit {
  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);

  constructor(private readonly store: Store) {}

  ngOnInit(): void {}
}

// function findNextEvent(): EventSchedule|null {
//   const nextEventIndex = SCHEDULE.findIndex(event => event.practice1.start.isAfter(NOW));
//   const previousEvent = SCHEDULE[nextEventIndex - 1];
//   Object.values(previousEvent).find(dateRange => dateRange.start && dateRange.start.isBefore(NOW))
// }
