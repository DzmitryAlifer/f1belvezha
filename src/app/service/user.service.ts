import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Params, User} from '../types';
import {HttpService} from './http.service';


@Injectable({providedIn: 'root'})
export class UserService {

  constructor(private readonly httpService: HttpService) {}

  getAllUsers(): Observable<User[]> {
    return this.httpService.getAll<User[]>('/users');
  }

  getUserById(id: number): Observable<User> {
    return this.httpService.getById<User>('/users', id);
  }

  createUser(user: User): Observable<User> {
    return this.httpService.post<User>('/users', user);
  }

  login(params: Params): Observable<User> {
    return this.httpService.login<User>('/login', params);
  }
}
