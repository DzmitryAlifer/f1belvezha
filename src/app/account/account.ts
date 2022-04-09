import {ChangeDetectionStrategy, Component} from '@angular/core';


@Component({
  selector: 'app-account',
  templateUrl: './account.html',
  styleUrls: ['./account.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {

  constructor() {}
}
