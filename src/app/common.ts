import * as moment from 'moment';
import {interval, Observable} from 'rxjs';
import {map, shareReplay, startWith} from 'rxjs/operators';
import {DisplayEvent, EventSchedule, EventType} from './toolbar/next-event/next-event.component';
import {DriverRoundResult, Prediction} from './types';


export const DRIVER_IN_LIST_PTS = 1;
export const DRIVER_PLACE_PTS = 2;

export const SCHEDULE: EventSchedule[] = [{
    location: 'Bahrain',
    qualification: {start: moment('2022-03-19T18:00:00+03:00'), end: moment('2022-03-19T19:00:00+03:00')},
    race: {start: moment('2022-03-20T18:00:00+03:00'), end: moment('2022-03-20T20:00:00+03:00')},
}, {
    location: 'Saudi Arabia',
    qualification: {start: moment('2022-03-26T18:00:00+03:00'), end: moment('2022-03-26T19:00:00+03:00')},
    race: {start: moment('2022-03-27T19:00:00+03:00'), end: moment('2022-03-27T21:00:00+03:00')},
}];

const NOW = moment();

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


export function getFlagLink(countryName: string): string {
    return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${COUNTRY_MAP.get(countryName)}.svg`;
}

function findNextEvent(): DisplayEvent {
    const nextEventIndex = SCHEDULE.findIndex(event => event.qualification.start.isAfter(NOW));
    const previousEvent = SCHEDULE[nextEventIndex - 1];

    if (nextEventIndex === 0 || previousEvent.race.end.isBefore(NOW)) {
        return {
            round: nextEventIndex + 1,
            location: SCHEDULE[nextEventIndex].location,
            eventType: EventType.Qualification,
            start: SCHEDULE[nextEventIndex].qualification.start,
        };
    }

    if (previousEvent.race.start.isBefore(NOW)) {
        return {
            round: nextEventIndex,
            location: previousEvent.location,
            eventType: EventType.Race,
            end: previousEvent.race.end,
        };
    }

    if (previousEvent.qualification.end.isBefore(NOW)) {
        return {
            round: nextEventIndex,
            location: previousEvent.location,
            eventType: EventType.Race,
            start: previousEvent.race.start,
        };
    }

    return {
        round: nextEventIndex,
        location: previousEvent.location,
        eventType: EventType.Qualification,
        end: previousEvent.qualification.end,
    };
}

export function getNextEvent(): Observable<DisplayEvent> {
    // Finds next event each 2 minutes
    return interval(2 * 60 * 1000).pipe(
        map(() => findNextEvent()),
        startWith(findNextEvent()),
        shareReplay(1),
    );
}

export function calculateRoundPoints(roundResult: DriverRoundResult, prediction: Prediction): number[][] {
    const qualifyngPredictionPoints = calculateEventPoints(roundResult.qualifying, prediction.qualification);
    const racePredictionPoints = calculateEventPoints(roundResult.race, prediction.race);

    return [qualifyngPredictionPoints, racePredictionPoints];
}

function calculateEventPoints(actualDrivers: string[], predictedDrivers: string[]): number[] {
    const driversInListPoints = actualDrivers.reduce((acc, actualDriver) => 
            acc + (predictedDrivers.includes(actualDriver) ? 1 : 0), 0);
    const driversPlacePoints = actualDrivers.reduce((acc, actualDriver, index) =>
        acc + (actualDriver === predictedDrivers[index] ? 1 : 0), 0);

    return [driversInListPoints, driversPlacePoints];
}