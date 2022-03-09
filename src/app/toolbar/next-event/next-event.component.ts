import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import * as moment from 'moment';
import {DisplayEvent, EventSchedule, EventType} from 'src/app/types';
import * as toolbarSelectors from '../store/toolbar.selectors';


const NOW = moment();

const SCHEDULE: EventSchedule[] = [{
  location: 'Bahrain',
  timezone: 'Asia/Bahrain',
  qualification: {start: moment('2022-03-19T18:00:00'), end: moment('2022-03-19T19:00:00')},
  race: {start: moment('2022-03-20T18:00:00'), end: moment('2022-03-20T20:00:00')},
}, {
  location: 'Saudi Arabia',
  timezone: 'Asia/Riyadh',
  qualification: {start: moment('2022-03-26T18:00:00'), end: moment('2022-03-26T19:00:00')},
  race: {start: moment('2022-03-27T19:00:00'), end: moment('2022-03-27T21:00:00')},
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
}

function findNextEvent(): DisplayEvent {
  const nextEventIndex = SCHEDULE.findIndex(event => event.qualification.start.tz(event.timezone).isAfter(NOW));
  const previousEvent = SCHEDULE[nextEventIndex - 1];
  
  if (previousEvent.race.end.tz(previousEvent.timezone).isBefore(NOW)) {
    return {
      location: SCHEDULE[nextEventIndex].location,
      eventType: EventType.Qualification,
      start: SCHEDULE[nextEventIndex].qualification.start.tz(previousEvent.timezone),
    };
  }

  if (previousEvent.race.start.tz(previousEvent.timezone).isBefore(NOW)) {
    return {
      location: previousEvent.location,
      eventType: EventType.Race,
      end: previousEvent.race.end.tz(previousEvent.timezone),
    };
  }

  if (previousEvent.qualification.end.tz(previousEvent.timezone).isBefore(NOW)) {
    return {
      location: previousEvent.location,
      eventType: EventType.Race,
      start: previousEvent.race.start.tz(previousEvent.timezone),
    };
  }

  return {
    location: previousEvent.location,
    eventType: EventType.Qualification,
    start: previousEvent.qualification.end.tz(previousEvent.timezone),
  };
}
