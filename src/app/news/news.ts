import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {BehaviorSubject, combineLatest, interval, merge, ReplaySubject} from 'rxjs';
import {filter, switchMap} from 'rxjs/operators';
import {Language} from '../enums';
import {NewsService} from '../service/news.service';


const NEWS_AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;


@Component({
  selector: 'news',
  templateUrl: './news.html',
  styleUrls: ['./news.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent {
  readonly Date = Date;
  readonly Language = Language;

  readonly savedAutoRefreshStatus = localStorage.getItem('auto-refresh') === 'true';
  private readonly refreshNewsSubject = new ReplaySubject<void>(1);
  private readonly toggleAutoRefreshSubject = new BehaviorSubject<boolean>(this.savedAutoRefreshStatus);
  private readonly autoRefreshNews = 
      combineLatest([this.toggleAutoRefreshSubject, interval(NEWS_AUTO_REFRESH_INTERVAL)])
          .pipe(filter(([checked]) => !!checked));
  private readonly triggerNewsRefresh = merge(this.refreshNewsSubject, this.autoRefreshNews);

  private readonly refreshedNewsEn = this.triggerNewsRefresh.pipe(
    switchMap(() => this.newsService.getNewsEn()));
  private readonly refreshedNewsRu = this.triggerNewsRefresh.pipe(
    switchMap(() => this.newsService.getNewsRu()));

  readonly newsLeftList = merge(this.newsService.getNewsEn(), this.refreshedNewsEn);
  readonly newsRightList = merge(this.newsService.getNewsRu(), this.refreshedNewsRu);

  constructor(private readonly newsService: NewsService) {}

  refreshNews(): void {
    this.refreshNewsSubject.next();
  }

  toggleAutoRefresh({checked}: MatSlideToggleChange): void {
    this.toggleAutoRefreshSubject.next(checked);
    localStorage.setItem('auto-refresh', checked.toString());
  }

  showNews(language: Language, index: number): void {
    (document.querySelector(`.${language} .text${index} .description .more`) as HTMLElement)?.click();
  }

  addTargetBlankAttribute(newsText: string): string {
    return newsText.replace('class=\'more\'', 'class=\'more\' target=\'_blank\'');
  }
}
