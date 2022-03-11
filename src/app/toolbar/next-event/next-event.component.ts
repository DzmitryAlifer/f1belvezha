import {ChangeDetectionStrategy, Component, AfterViewInit} from '@angular/core';
import {Store} from '@ngrx/store';
import * as moment from 'moment';
import {combineLatest, interval} from 'rxjs';
import {map} from 'rxjs/operators';
import {findNextEvent, getFlagLink, getNextEvent} from 'src/app/common';
import {CountDownDigits} from 'src/app/types';
import * as toolbarSelectors from '../store/toolbar.selectors';


export enum EventType {
  Qualification = 'qual',
  Race = 'race',
}

export interface EventSchedule {
  location: string;
  qualification: DateRange;
  race: DateRange;
}

export interface DisplayEvent {
  round: number;
  location: string;
  eventType: EventType;
  start?: moment.Moment;
  end?: moment.Moment;
}

export interface DateRange {
  start: moment.Moment;
  end: moment.Moment;
}


@Component({
  selector: 'next-event',
  templateUrl: './next-event.component.html',
  styleUrls: ['./next-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextEventComponent implements AfterViewInit {
  readonly nextEvent = getNextEvent();
  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);

  constructor(private readonly store: Store) {}

  ngAfterViewInit(): void {
    combineLatest([this.nextEvent, interval(1000)]).pipe(
      map(([nextEvent]) => {
        const digits = getCountDownDigits(nextEvent);
        document.getElementById('days')!.innerText = digits.daysDigits;
        document.getElementById('hours')!.innerText = digits.hoursDigits;
        document.getElementById('mins')!.innerText = digits.minutesDigits;
        document.getElementById('seconds')!.innerText = digits.secondsDigits;
      }),
    ).subscribe();
  }

  getFlagLink(countryName: string): string {
    return getFlagLink(countryName);
  }
}

function getCountDownDigits(nextEvent: DisplayEvent): CountDownDigits {
  let daysDigits;
  let hoursDigits;
  let minutesDigits;
  let secondsDigits;

  if (nextEvent.start) {
    const difference = moment.duration(nextEvent.start?.diff(moment())).asMilliseconds();
    let seconds = Math.floor(difference / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    hours %= 24;
    minutes %= 60;
    seconds %= 60;
    daysDigits = (days < 10 ? '0' + days : days).toString();
    hoursDigits = (hours < 10 ? '0' + hours : hours).toString();
    minutesDigits = (minutes < 10 ? '0' + minutes : minutes).toString();
    secondsDigits = (seconds < 10 ? '0' + seconds : seconds).toString();
  } else {
    daysDigits = 'n';
    hoursDigits = 'o';
    minutesDigits = 'w';
    secondsDigits = '';
  }

  return { daysDigits, hoursDigits, minutesDigits, secondsDigits } as CountDownDigits;
}
