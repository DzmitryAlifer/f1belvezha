import { Component } from '@angular/core';
import { HttpClient } from  '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../types';
import {Sort} from '@angular/material/sort';

@Component({
  selector: 'full-results',
  templateUrl: './full-results.component.html',
  styleUrls: ['./full-results.component.scss'],
})
export class FullResultsComponent {
  readonly displayedColumns: string[] = ['id', 'name', 'total'];

  readonly sortSubject = new BehaviorSubject<Sort>({active: 'id', direction: 'asc'});

  readonly users: Observable<User[]> = 
      this.http.get<User[]>('https://safe-crag-81937.herokuapp.com/users');
  readonly userById: Observable<User> = 
      this.http.get<User>('https://safe-crag-81937.herokuapp.com/users/1');
  
  readonly sortedUsers = combineLatest([this.users, this.sortSubject]).pipe(
    map(([users, sort]) =>
      users.sort((left: User, right: User) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'id':
            return compare(left.id, right.id, isAsc);
          case 'name':
            return compare(left.firstname + left.lastname ?? '', right.lastname ?? '', isAsc);
          default:
            return 0;
        }  
      }),
    ),
  );

  constructor(private http: HttpClient) {}

  sortData(sort: Sort) {
    this.sortSubject.next(sort);
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
