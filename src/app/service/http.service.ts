import {Injectable} from '@angular/core';
import {HttpClient} from  '@angular/common/http';
import {Observable} from 'rxjs';
import {Params} from '../types';


const API_DOMAIN = 'https://safe-crag-81937.herokuapp.com';


@Injectable({providedIn: 'root'})
export class HttpService {

  constructor(private readonly httpClient: HttpClient) {}

  getAll<T>(apiPath: string): Observable<T> {
    return this.httpClient.get<T>(`${API_DOMAIN}${apiPath}`);
  }

  getById<T>(apiPath: string, id: number|string): Observable<T> {
    return this.httpClient.get<T>(`${API_DOMAIN}${apiPath}/${id}`);
  }

  getByParams<T>(apiPath: string, queryParams: Params): Observable<T> {
    const queryParamsUri = Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');
    return this.httpClient.get<T>(`${API_DOMAIN}${apiPath}?${queryParamsUri}`);
  }

  post<T>(apiPath: string, entity: T): Observable<T> {
    return this.httpClient.post<T>(`${API_DOMAIN}${apiPath}`, entity);
  }

  put<T>(apiPath: string, entity: T): Observable<T> {
    return this.httpClient.put<T>(`${API_DOMAIN}${apiPath}`, entity);
  }

  login<T>(apiPath: string, body: Params): Observable<T> {
    return this.httpClient.post<T>(`${API_DOMAIN}${apiPath}`, body);
  }
}
