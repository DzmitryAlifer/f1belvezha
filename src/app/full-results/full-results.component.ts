import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../types';
import {Sort} from '@angular/material/sort';
import { UserService } from '../service/user.service';
import { ScheduleService } from '../service/schedule.service';

@Component({
  selector: 'full-results',
  templateUrl: './full-results.component.html',
  styleUrls: ['./full-results.component.scss'],
})
export class FullResultsComponent {
  readonly displayedColumns: string[] = ['id', 'name', 'total'];

  readonly sortSubject = new BehaviorSubject<Sort>({active: 'id', direction: 'asc'});
  readonly users = this.userService.getAllUsers();
  readonly races = this.scheduleService.getCurrentYearSchedule();

  
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

  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly userService: UserService,
  ) {this.races.subscribe(r => console.log(r))}

  sortData(sort: Sort) {
    this.sortSubject.next(sort);
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
