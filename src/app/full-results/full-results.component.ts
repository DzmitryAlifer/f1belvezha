import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../types';
import {Sort} from '@angular/material/sort';
import { UserService } from '../service/user.service';
import { ScheduleService } from '../service/schedule.service';

const COUNTRY_MAP = new Map<string, string>()
    .set('Bahrain', 'BH')
    .set('Saudi Arabia', 'SA')
    .set('Australia', 'AU')
    .set('Italy', 'IT')
    .set('United States', 'US')
    .set('Spain', 'ES')
    .set('Monaco', 'MC')
    .set('Azerbaijan', 'AZ')
    .set('Canada', 'CA')
    .set('UK', 'GB')
    .set('Austria', 'AT')
    .set('France', 'FR')
    .set('Hungary', 'HU')
    .set('Belgium', 'BE')
    .set('Netherlands', 'NL')
    .set('Russia', 'RU')
    .set('Singapore', 'SG')
    .set('Japan', 'JP')
    .set('USA', 'US')
    .set('Mexico', 'MX')
    .set('Brazil', 'BR')
    .set('UAE', 'AE');

@Component({
  selector: 'full-results',
  templateUrl: './full-results.component.html',
  styleUrls: ['./full-results.component.scss'],
})
export class FullResultsComponent {
  readonly sortSubject = new BehaviorSubject<Sort>({active: 'id', direction: 'asc'});
  readonly users = this.userService.getAllUsers();
  readonly races = this.scheduleService.getCurrentYearSchedule();
  
  readonly isLoaded = combineLatest([this.users, this.races]).pipe(
    map(([users, races]) => !!races && !!users));

  readonly displayedColumns: Observable<string[]> = this.races.pipe(
    map(races => ['name', ...races.map(race => 'round' + race.round), 'total']));
  
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
  ) {}

  sortData(sort: Sort): void {
    this.sortSubject.next(sort);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);

    return `${month}, ${day}`;
  }

  getFlagLink(countryName: string): string {
    return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${COUNTRY_MAP.get(countryName)}.svg`;
  }
}

function compare(left: number | string, right: number | string, isAsc: boolean) {
  return (left < right ? -1 : 1) * (isAsc ? 1 : -1);
}
