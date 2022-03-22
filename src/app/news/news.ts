import {ChangeDetectionStrategy, Component} from '@angular/core';


@Component({
  selector: 'news',
  templateUrl: './news.html',
  styleUrls: ['./news.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent {

  constructor() {}
}
