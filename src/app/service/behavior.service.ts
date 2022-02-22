import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';


@Injectable({providedIn: 'root'})
export class BehaviorService {

  private readonly reloadUsersSubject = new ReplaySubject<void>();

  constructor() {}

  reloadUsers(): void {
    this.reloadUsersSubject.next();
  }

  isUsersReload(): Observable<void> {
    return this.reloadUsersSubject.asObservable();
  }
}
