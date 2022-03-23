import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NewsService} from '../service/news.service';


@Component({
  selector: 'news',
  templateUrl: './news.html',
  styleUrls: ['./news.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent {
  readonly newsList = this.newsService.getNews();

  constructor(private readonly newsService: NewsService) {}
}
