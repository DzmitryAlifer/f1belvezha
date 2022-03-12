import {ChangeDetectionStrategy, Component} from '@angular/core';


@Component({
  selector: 'coin',
  templateUrl: './coin.html',
  styleUrls: ['./coin.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinComponent {

  constructor() {}
}
