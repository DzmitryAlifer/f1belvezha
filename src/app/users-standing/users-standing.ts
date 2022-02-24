import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'users-standing',
  templateUrl: './users-standing.html',
  styleUrls: ['./users-standing.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersStandingComponent {

  constructor() {}
}
