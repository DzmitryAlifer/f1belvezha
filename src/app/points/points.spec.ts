import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PointsComponent } from './points.component';
import { Store } from '@ngrx/store';
import { CoinModule } from '../coin/coin.module';
import { of } from 'rxjs';
import { Race } from 'src/app/types';
import * as moment from 'moment';


const DATE_TIME = {
    date: 'test_date',
    time: 'test_time',
};

const RACE: Race = {
    season: 111,
    round: 222,
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


describe('PointsComponent', () => {
    let component: PointsComponent;
    let fixture: ComponentFixture<PointsComponent>;

    it('points for the finished race', async () => {
        const race1IsFinishedMoment = moment();
        const race1StartMoment = race1IsFinishedMoment.subtract(4, 'hours');
        const quali1StartMoment = race1StartMoment.subtract(1, 'days');
        const race1StartDateTimeArray = race1StartMoment.toISOString().split('T');
        const quali1StartDateTimeArray = quali1StartMoment.toISOString().split('T');
        
        const event1 = { 
            ...RACE,
            Qualifying: { date: quali1StartDateTimeArray[0], time: quali1StartDateTimeArray[1] },
            date: race1StartDateTimeArray[0], 
            time: race1StartDateTimeArray[1],
        };

        const race2StartMoment = race1StartMoment.add(7, 'days');
        const quali2StartMoment = quali1StartMoment.add(7, 'days');
        const race2StartDateTimeArray = race2StartMoment.toISOString().split('T');
        const quali2StartDateTimeArray = quali2StartMoment.toISOString().split('T');
        
        const event2 = {
            ...RACE,
            Qualifying: { date: quali2StartDateTimeArray[0], time: quali2StartDateTimeArray[1] },
            date: race2StartDateTimeArray[0],
            time: race2StartDateTimeArray[1],
        };

        await TestBed.configureTestingModule({
            declarations: [PointsComponent],
            imports: [CoinModule],
            providers: [
                {
                    provide: Store, useValue: {
                        select: () => of([event1, event2]),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PointsComponent);
        component = fixture.componentInstance;
        component.points = [[2, 2], [2, 1], null];
        fixture.detectChanges();

        let resultPoints = fixture.nativeElement.querySelector('.total b').innerText;

        expect(resultPoints).toBe('10');
    });
});
