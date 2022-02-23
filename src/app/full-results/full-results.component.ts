import {ChangeDetectionStrategy, Component, EventEmitter} from '@angular/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {Sort} from '@angular/material/sort';
import {BehaviorSubject, combineLatest, merge} from 'rxjs';
import {map, shareReplay, startWith, switchMap} from 'rxjs/operators';
import {User} from '../types';
import {UserService} from '../service/user.service';
import {ScheduleService} from '../service/schedule.service';
import * as moment from 'moment';
import {BehaviorService} from '../service/behavior.service';

const NUMBER_OF_PAST_RACES = 3;
const NUMBER_OF_FUTURE_RACES = 2;

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullResultsComponent {
  private readonly sortSubject = new BehaviorSubject<Sort>({active: 'id', direction: 'asc'});
  private readonly tableToggle = new EventEmitter<boolean>();

  readonly currentUserId = merge(
    this.behaviorService.getCurrentUser(), 
    this.userService.getCurrentUser(),
  ).pipe(map(user => user?.id));

  private readonly initialUsers = this.userService.getAllUsers().pipe(shareReplay(1));
  private readonly reloadedUsers = this.behaviorService.isUsersReload().pipe(switchMap(() => this.userService.getAllUsers()));
  private readonly users = merge(this.initialUsers, this.reloadedUsers);

  readonly allRaces = this.scheduleService.getCurrentYearSchedule().pipe(shareReplay(1));
  readonly isLoaded = combineLatest([this.users, this.allRaces]).pipe(map(([users, races]) => !!races && !!users));

  private readonly filteredRaces = this.allRaces.pipe(
    map(races => {
      const lastRaceIndex = races.findIndex(race => moment().isBefore(race.date));
      const firstShownRaceIndex = Math.max(0, lastRaceIndex - NUMBER_OF_PAST_RACES);
      return races.slice(firstShownRaceIndex, lastRaceIndex + NUMBER_OF_FUTURE_RACES);
    }));

  private readonly races = this.tableToggle.pipe(
    startWith(false),
    switchMap(isChecked => isChecked ? this.allRaces : this.filteredRaces),
  );

  private readonly raceColumns = this.races.pipe(map(races => races.map(race => 'round' + race.round)));
  readonly displayedColumns = this.raceColumns.pipe(map(raceColumns => ['name', ...raceColumns, 'total']));
  
  readonly sortedUsers = combineLatest([this.users, this.sortSubject]).pipe(
    map(([users, sort]) =>
      users.sort((left: User, right: User) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'id':
            return compare(left.id!, right.id!, isAsc);
          case 'name':
            return compare(left.firstname + left.lastname ?? '', right.lastname ?? '', isAsc);
          default:
            return 0;
        }  
      }),
    ),
  );

  constructor(
    private readonly behaviorService: BehaviorService,
    private readonly scheduleService: ScheduleService,
    private readonly userService: UserService,
  ) {;
  }

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

  toggle(event: MatSlideToggleChange): void {
    this.tableToggle.emit(event.checked);
  }
}

function compare(left: number | string, right: number | string, isAsc: boolean) {
  return (left < right ? -1 : 1) * (isAsc ? 1 : -1);
}
