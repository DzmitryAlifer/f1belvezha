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

  post<T>(apiPath: string, entity: T): Observable<T> {
    return this.httpClient.post<T>(`${API_DOMAIN}${apiPath}`, entity);
  }

  getByParams<T>(apiPath: string, params: Params): Observable<T> {
    return this.httpClient.get<T>(`${API_DOMAIN}${apiPath}`, params);
  }
}
