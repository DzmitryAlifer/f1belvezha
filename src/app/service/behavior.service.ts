import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';


@Injectable({providedIn: 'root'})
export class BehaviorService {

  private readonly reloadUsersSubject = new ReplaySubject<void>();
  private readonly showUserToolbarSubject = new ReplaySubject<void>();

  constructor() {}

  reloadUsers(): void {
    this.reloadUsersSubject.next();
  }

  isUsersReload(): Observable<void> {
    return this.reloadUsersSubject.asObservable();
  }

  showUserToolbar(): void {
    this.showUserToolbarSubject.next();
  }

  isUserToolbar(): Observable<void> {
    return this.showUserToolbarSubject.asObservable();
  }
}
