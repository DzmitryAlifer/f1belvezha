import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {News, NewsResponse} from '../types';
import {HttpService} from './http.service';


@Injectable({providedIn: 'root'})
export class NewsService {

  constructor(private readonly httpService: HttpService) {}

  getNews(): Observable<News[]> {
    return this.httpService.getAll<NewsResponse>('/news').pipe(
      map(newsResponse => newsResponse.rss.channel[0].item.map(rssNews => ({
        guid: Number(rssNews.guid[0]._),
        title: rssNews.title[0],
        link: rssNews.link[0],
        description: rssNews.description[0],
        pubDate: new Date(rssNews.pubDate[0]),
        enclosure: rssNews.enclosure[0].$.url,
      }))),
    );
  }
}
