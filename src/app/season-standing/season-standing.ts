import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';


@Component({
  selector: 'season-standing',
  templateUrl: './season-standing.html',
  styleUrls: ['./season-standing.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeasonStandingComponent {

  constructor(private readonly store: Store) {}
}
