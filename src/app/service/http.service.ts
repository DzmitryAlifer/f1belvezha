import { Injectable } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { Observable } from 'rxjs';

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
}
