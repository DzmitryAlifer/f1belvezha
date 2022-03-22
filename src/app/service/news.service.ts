import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

const HOME = 'https://f1sport.herokuapp.com/';
const AUTOSPORT_COM_RSS_URL = 'https://www.autosport.com/rss/f1/news/';


@Injectable({providedIn: 'root'})
export class NewsService {

  constructor(private readonly httpClient: HttpClient) {}

  getNews(): Observable<Object> {
    return this.httpClient.get(HOME + AUTOSPORT_COM_RSS_URL);
  }
}
