import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NewsService} from '../service/news.service';


@Component({
  selector: 'news',
  templateUrl: './news.html',
  styleUrls: ['./news.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent {
  readonly Date = Date;

  readonly newsLeftList = this.newsService.getNewsEn();
  readonly newsRightList = this.newsService.getNewsRu();

  constructor(private readonly newsService: NewsService) {}

  addTargetBlankAttribute(newsText: string): string {
    return newsText.replace('class=\'more\'', 'class=\'more\' target=\'_blank\'');
  }
}
