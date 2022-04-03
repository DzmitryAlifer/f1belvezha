import {ChangeDetectionStrategy, Component, Input} from '@angular/core';


@Component({
  selector: 'coin',
  templateUrl: './coin.html',
  styleUrls: ['./coin.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinComponent {
  @Input() value = 0;
  @Input() amount = 1;
  @Input() color = '';

  readonly Array = Array;
}
