import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {CURRENT_USER_KEY} from 'src/constants';
import {Params, User} from '../types';
import {HttpService} from './http.service';
import {LocalStorageService} from './local-storage.service';


@Injectable({providedIn: 'root'})
export class UserService {

  constructor(
    private readonly httpService: HttpService,
    private readonly localStorageService: LocalStorageService,
  ) {}

  getCurrentUser(): Observable<User|null> {
    return of(this.localStorageService.getItem<User>(CURRENT_USER_KEY));
  }

  getAllUsers(): Observable<User[]> {
    return this.httpService.getAll<User[]>('/users');
  }

  getUserById(id: number): Observable<User> {
    return this.httpService.getById<User>('/users', id);
  }

  createUser(user: User): Observable<User> {
    return this.httpService.post<User>('/users', user);
  }

  login(params: Params): Observable<User|null> {
    return this.httpService.login<User>('/login', params);
  }
}
