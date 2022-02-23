import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {User} from '../types';


@Injectable({providedIn: 'root'})
export class BehaviorService {
  private readonly reloadUsersSubject = new ReplaySubject<void>();
  private readonly currentUser = new BehaviorSubject<User|null>(null);

  constructor() {}

  reloadUsers(): void {
    this.reloadUsersSubject.next();
  }

  isUsersReload(): Observable<void> {
    return this.reloadUsersSubject.asObservable();
  }

  setCurrentUser(user: User|null): void {
    this.currentUser.next(user);
  }

  getCurrentUser(): Observable<User|null> {
    return this.currentUser.asObservable();
  }
}
