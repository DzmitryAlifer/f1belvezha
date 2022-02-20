import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../types';
import { HttpService } from './http.service';

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(private readonly httpService: HttpService) {}

  getAllUsers(): Observable<User[]> {
    return this.httpService.getAll<User[]>('/users');
  }

  getUserById(id: number): Observable<User> {
    return this.httpService.getById<User>('/users', id);
  }
}
