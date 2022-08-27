import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { FullResultsComponent } from './full-results.component';
import { StoreModule } from '@ngrx/store';
import { DriverRoundResult, Prediction, Race, User } from 'src/app/types';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fullResultsSelectors from './store/full-results.selectors';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';
import { MatTableModule } from '@angular/material/table';
import * as moment from 'moment';


const ROUND_NUMBER = 222;

const USER = {
    id: 123,
    username: 'test_username',
    firstname: 'Test First Name',
    lastname: 'Test Last Name',
} as User;

const PREDICTION = {
    userid: USER.id,
    round: ROUND_NUMBER,
    qualification: ['pilot_A', 'pilot_B', 'pilot_C', 'pilot_D', 'pilot_E'],
    race: ['pilot_F', 'pilot_G', 'pilot_H', 'pilot_I', 'pilot_J'],
    team_vs_team: [],
} as Prediction;

const DATE_TIME_ARRAY = moment().toISOString().split('T');

const DATE_TIME = {
    date: DATE_TIME_ARRAY[0],
    time: DATE_TIME_ARRAY[1],
};

const RACE: Race = {
    season: 2022,
    round: ROUND_NUMBER,
    raceName: 'Test Race',
    Circuit: {
        Location: {country: 'Test Country'},
    },
    FirstPractice: DATE_TIME,
    SecondPractice: DATE_TIME,
    ThirdPractice: DATE_TIME,
    Qualifying: DATE_TIME,
    Sprint: DATE_TIME,
    date: DATE_TIME.date,
    time: DATE_TIME.time,
};

const DRIVER_ROUND_RESULT: DriverRoundResult = {
    year: 2022,
    round: ROUND_NUMBER,
    qualifying: ['pilot_E', 'pilot_D', 'pilot_C', 'pilot_B', 'pilot_A'],
    race: ['pilot_F', 'pilot_A', 'pilot_H', 'pilot_B', 'pilot_J'],
};

const CURRENT_YEAR_POINTS: Map<number, Map<number, number[][]>> = 
    new Map<number, Map<number, number[][]>>()
        .set(USER.id!, new Map<number, number[][]>().set(ROUND_NUMBER, [[0, 0], [0, 0], [0, 0]]));

describe('FullResultsComponent', () => {
    let component: FullResultsComponent;
    let fixture: ComponentFixture<FullResultsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FullResultsComponent],
            imports: [
                MatTableModule,
                StoreModule.forRoot({}),
            ],
            providers: [
                { provide: MatDialog, useValue: {} },
                {
                    provide: Store, useValue: {
                        dispatch: () => {},
                        select: (selector: any) => {
                            switch(selector) {
                                case toolbarSelectors.selectIsDarkMode:
                                    return of(true);
                                case fullResultsSelectors.selectUsers:
                                    return of([USER]);
                                case toolbarSelectors.selectCurrentUser:
                                    return of(USER);
                                case fullResultsSelectors.selectAllPredictions:
                                    return of([PREDICTION]);
                                case fullResultsSelectors.selectRaces:
                                case toolbarSelectors.selectCalendar:
                                    return of([RACE]);
                                case fullResultsSelectors.selectCurrentYearResults:
                                    return of([DRIVER_ROUND_RESULT]);
                                case fullResultsSelectors.selectCurrentYearTeamVsTeamList:
                                    return of([]);
                                case fullResultsSelectors.selectCurrentYearPoints:
                                    return of(CURRENT_YEAR_POINTS);
                                default:
                                    return of(); 
                            }
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FullResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should calculate race points for the user', () => {
        const userId = 111;
        const roundNumber = 222;
        const points = new Map<number, Map<number, Array<number[] | null>>>()
            .set(userId, new Map<number, Array<number[] | null>>().set(roundNumber, [[2, 2], [3, 1], null]));
        const user = { id: userId } as User;
        const race = { round: roundNumber } as Race;
        const result = component.getPoints(points, user, race);

        expect(result).toEqual([[2, 2], [3, 1], null]);
    });

    fit('should show correct points', () => {
        let resultPoints = fixture.nativeElement.querySelector('.event').innerText;

        expect(resultPoints).toBe('10');
    });
});
