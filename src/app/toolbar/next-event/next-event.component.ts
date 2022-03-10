import {ChangeDetectionStrategy, Component, AfterViewInit} from '@angular/core';
import {Store} from '@ngrx/store';
import * as moment from 'moment';
import {findNextEvent, getFlagLink} from 'src/app/common';
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
  readonly nextEvent = findNextEvent();
  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);

  constructor(private readonly store: Store) {}

  ngAfterViewInit(): void {
    this.setCountDown();
  }

  getFlagLink(countryName: string): string {
    return getFlagLink(countryName);
  }

  setCountDown() {
    const nextEvent = findNextEvent();

    if (nextEvent.start) {
      const difference = moment.duration(nextEvent.start?.diff(moment())).asMilliseconds(); 
      let seconds = Math.floor(difference / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      hours %= 24;
      minutes %= 60;
      seconds %= 60;
      document.getElementById('days')!.innerText = (days < 10 ? '0' + days : days).toString();
      document.getElementById('hours')!.innerText = (hours < 10 ? '0' + hours : hours).toString();
      document.getElementById('mins')!.innerText = (minutes < 10 ? '0' + minutes : minutes).toString();
      document.getElementById('seconds')!.innerText = (seconds < 10 ? '0' + seconds : seconds).toString();
    } else {
      document.getElementById('days')!.innerText = 'n';
      document.getElementById('hours')!.innerText = 'o';
      document.getElementById('mins')!.innerText = 'w';
      document.getElementById('seconds')!.innerText = '';
    }

    setInterval(this.setCountDown, 1000);
  }
}


