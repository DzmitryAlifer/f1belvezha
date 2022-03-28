import {ChangeDetectionStrategy, Component} from '@angular/core';
import { Store } from '@ngrx/store';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';


@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  readonly races = this.store.select(toolbarSelectors.selectCalendar);

  constructor(private readonly store: Store) {this.races.subscribe(p=>console.log(p))}

}
