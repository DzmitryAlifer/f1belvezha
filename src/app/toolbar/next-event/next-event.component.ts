import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import * as moment from 'moment';
import { getFlagLink } from 'src/app/full-results/common';
import * as toolbarSelectors from '../store/toolbar.selectors';


export enum EventType {
  Qualification = 'qualification',
  Race = 'race',
}

export interface EventSchedule {
  location: string;
  qualification: DateRange;
  race: DateRange;
}

export interface DisplayEvent {
  location: string;
  eventType: EventType;
  start?: moment.Moment;
  end?: moment.Moment;
}

export interface DateRange {
  start: moment.Moment;
  end: moment.Moment;
}


const NOW = moment();

const SCHEDULE: EventSchedule[] = [{
  location: 'Bahrain',
  qualification: {start: moment('2022-03-19T18:00:00+03:00'), end: moment('2022-03-19T19:00:00+03:00')},
  race: {start: moment('2022-03-20T18:00:00+03:00'), end: moment('2022-03-20T20:00:00+03:00')},
}, {
  location: 'Saudi Arabia',
  qualification: {start: moment('2022-03-26T18:00:00+03:00'), end: moment('2022-03-26T19:00:00+03:00')},
  race: {start: moment('2022-03-27T19:00:00+03:00'), end: moment('2022-03-27T21:00:00+03:00')},
}];


@Component({
  selector: 'next-event',
  templateUrl: './next-event.component.html',
  styleUrls: ['./next-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextEventComponent implements OnInit {
  readonly nextEvent = findNextEvent();
  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);

  constructor(private readonly store: Store) {}

  ngOnInit(): void {}

  getFlagLink(countryName: string): string {
    return getFlagLink(countryName);
  }

  getCountDown(start: moment.Moment): string {
    return '';
  }
}

function findNextEvent(): DisplayEvent {
  const nextEventIndex = SCHEDULE.findIndex(event => event.qualification.start.isAfter(NOW));
  const previousEvent = SCHEDULE[nextEventIndex - 1];
  
  if (nextEventIndex === 0 || previousEvent.race.end.isBefore(NOW)) {
    return {
      location: SCHEDULE[nextEventIndex].location,
      eventType: EventType.Qualification,
      start: SCHEDULE[nextEventIndex].qualification.start,
    };
  }

  if (previousEvent.race.start.isBefore(NOW)) {
    return {
      location: previousEvent.location,
      eventType: EventType.Race,
      end: previousEvent.race.end,
    };
  }

  if (previousEvent.qualification.end.isBefore(NOW)) {
    return {
      location: previousEvent.location,
      eventType: EventType.Race,
      start: previousEvent.race.start,
    };
  }

  return {
    location: previousEvent.location,
    eventType: EventType.Qualification,
    start: previousEvent.qualification.end,
  };
}
