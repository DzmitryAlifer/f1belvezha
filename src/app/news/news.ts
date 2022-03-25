import {ChangeDetectionStrategy, Component} from '@angular/core';
import {merge, ReplaySubject} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {NewsService} from '../service/news.service';


@Component({
  selector: 'news',
  templateUrl: './news.html',
  styleUrls: ['./news.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent {
  readonly Date = Date;

  private readonly refreshNewsSubject = new ReplaySubject<void>(1);

  private readonly refreshedNewsEn = this.refreshNewsSubject.pipe(
    switchMap(() => this.newsService.getNewsEn()));
  private readonly refreshedNewsRu = this.refreshNewsSubject.pipe(
    switchMap(() => this.newsService.getNewsRu()));

  readonly newsLeftList = merge(this.newsService.getNewsEn(), this.refreshedNewsEn);
  readonly newsRightList = merge(this.newsService.getNewsRu(), this.refreshedNewsRu);

  constructor(private readonly newsService: NewsService) {}

  refreshNews(): void {
    this.refreshNewsSubject.next();
  }

  addTargetBlankAttribute(newsText: string): string {
    return newsText.replace('class=\'more\'', 'class=\'more\' target=\'_blank\'');
  }
}
