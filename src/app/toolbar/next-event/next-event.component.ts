import {AfterViewInit, ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import * as moment from 'moment';
import {combineLatest, interval, timer} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {findNextEvent2, getFlagLink, getNextEvent} from 'src/app/common';
import {CountDownDigits, DisplayEvent} from 'src/app/types';
import * as toolbarSelectors from '../store/toolbar.selectors';


const COUNTDOWN_NOW: CountDownDigits = {daysDigits: 'n', hoursDigits: 'o', minutesDigits: 'w', secondsDigits: ''};


@Component({
  selector: 'next-event',
  templateUrl: './next-event.component.html',
  styleUrls: ['./next-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextEventComponent implements AfterViewInit {
  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly calendarEvents = this.store.select(toolbarSelectors.selectCalendar);
  readonly nextEvent2 = getNextEvent();
  // Finds next event each 2 minutes
  readonly nextEvent = combineLatest([this.calendarEvents, timer(0, 5 * 60 * 1000)]).pipe(
    filter(([calendarEvents]) => !!calendarEvents.length),
    map(([calendarEvents]) => findNextEvent2(calendarEvents)),
  );

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
  if (!nextEvent.start) {
    return COUNTDOWN_NOW;
  }

  const difference = moment.duration(nextEvent.start?.diff(moment())).asMilliseconds();
  let seconds = Math.floor(difference / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  hours %= 24;
  minutes %= 60;
  seconds %= 60;
  const daysDigits = (days < 10 ? '0' + days : days).toString();
  const hoursDigits = (hours < 10 ? '0' + hours : hours).toString();
  const minutesDigits = (minutes < 10 ? '0' + minutes : minutes).toString();
  const secondsDigits = (seconds < 10 ? '0' + seconds : seconds).toString();

  return days >= 0 && hours >= 0 && minutes >= 0 && seconds >= 0 ? 
      {daysDigits, hoursDigits, minutesDigits, secondsDigits} :
      COUNTDOWN_NOW;
}
