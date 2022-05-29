import * as moment from 'moment';
import {interval, Observable} from 'rxjs';
import {filter, map, shareReplay, startWith} from 'rxjs/operators';
import {DRIVER_ID_NAME_MAPPING, DRIVER_TEAM_MAPPING} from 'src/constants';
import {EventType, TeamName} from './enums';
import {DisplayEvent, EventSchedule} from './types';
import {DateTimeApi, Driver, DriverRoundResult, DriverStanding, PlayerRoundResult, Prediction, Race, TeamVsTeam, User, UserPoints} from './types';

declare let anime: any;
export const DRIVER_IN_LIST_PTS = 1;
export const DRIVER_PLACE_PTS = 2;
export const WRONG_TEAM_PTS = -1;
export const CORRECT_TEAM_FROM_PAIR_PTS = 1;

export const SCHEDULE: EventSchedule[] = [{
    location: 'Bahrain',
    qualification: {start: moment('2022-03-19T18:00:00+03:00'), end: moment('2022-03-19T19:00:00+03:00')},
    race: {start: moment('2022-03-20T18:00:00+03:00'), end: moment('2022-03-20T20:00:00+03:00')},
}, {
    location: 'Saudi Arabia',
    qualification: {start: moment('2022-03-26T20:00:00+03:00'), end: moment('2022-03-26T21:00:00+03:00')},
    race: {start: moment('2022-03-27T20:00:00+03:00'), end: moment('2022-03-27T22:00:00+03:00')},
}, {
    location: 'Australia',
    qualification: {start: moment('2022-04-09T16:00:00+10:00'), end: moment('2022-04-09T17:00:00+10:00')},
    race: {start: moment('2022-04-10T15:00:00+10:00'), end: moment('2022-04-10T17:00:00+10:00')},
}, {
    location: 'Italy',
    qualification: {start: moment('2022-04-23T16:00:00+01:00'), end: moment('2022-04-23T17:00:00+01:00')},
    race: {start: moment('2022-04-24T15:00:00+01:00'), end: moment('2022-04-24T17:00:00+01:00')},
} ];

export const NOT_SELECTED_DRIVER_NAME = 'not selected';

export const NOT_SELECTED_DRIVER_POSITION: DriverStanding = {
    position: 100,
    points: 0,
    wins: 0,
    Driver: {familyName: NOT_SELECTED_DRIVER_NAME} as Driver,
}; 

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


export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const month = new Intl.DateTimeFormat('en', {month: 'short'}).format(date);
    const day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date);

    return `${month} ${day}`;
}

export function formatDateTime(dateTime: DateTimeApi): string {
    if (!dateTime) {
        return '-';
    }

    const date = new Date(`${dateTime.date}T${dateTime.time}`);
    const month = new Intl.DateTimeFormat('en', {month: 'short'}).format(date);
    const day = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date);
    const time = new Intl.DateTimeFormat('en', {hour: '2-digit', minute: '2-digit', hour12: false}).format(date);

    return `${month} ${day}, ${time}`;
}

export function getFlagLink(countryName: string): string {
    return `http://purecatamphetamine.github.io/country-flag-icons/3x2/${COUNTRY_MAP.get(countryName)}.svg`;
}

export function getCircuitPath(countryName: string, isLarge = false): string {
    const smallOrLarge = isLarge ? 'large' : 'small';
    return `/assets/images/circuits/${smallOrLarge}/${countryName}.png`;
}

export function getBolidPath(driverFamilyName: string): string {
    const teamId = DRIVER_TEAM_MAPPING.get(driverFamilyName);
    return `/assets/images/bolids/${teamId}.png`;
}

export function getTeamNameByDriverId(driverId: string): TeamName {
    const driverLastName = DRIVER_ID_NAME_MAPPING.get(driverId) ?? '';
    return DRIVER_TEAM_MAPPING.get(driverLastName) ?? TeamName.None;
}

function toMoment2(date: string, time: string): moment.Moment {
    return moment(new Date(`${date}T${time}`));
}

function toMoment(dateTime: DateTimeApi): moment.Moment {
    return toMoment2(dateTime.date, dateTime.time);
}

export function findNextEvent2(races: Race[]): DisplayEvent|null {
    if (!races.length) {
        return null;
    }

    const NOW = moment();
    const nextEventIndex = races.findIndex(event => toMoment(event).isAfter(NOW));
    const previousEvent = races[nextEventIndex - 1];
    const previousEventQualifyingStart = toMoment(previousEvent.Qualifying);
    const previousEventQualifyingEnd = previousEventQualifyingStart.clone().add(1, 'hours');
    const previousEventRaceStart = toMoment(previousEvent);
    const previousEventRaceEnd = previousEventRaceStart.clone().add(2, 'hours');
    const nextEvent = races[nextEventIndex];
    const nextEventQualifyingStart = toMoment(nextEvent.Qualifying);
    const nextEventQualifyingEnd = nextEventQualifyingStart.clone().add(1, 'hours');
    const nextEventRaceStart = toMoment(nextEvent);
    const nextEventRaceEnd = nextEventRaceStart.clone().add(2, 'hours');

    if (nextEventIndex === 0) {
        return {
            round: nextEventIndex + 1,
            location: nextEvent.Circuit.Location.country,
            eventType: EventType.Qualification,
            start: nextEventQualifyingStart,
        };
    }

    if (nextEventRaceStart.isBefore(NOW)) {
        return {
            round: nextEventIndex + 1,
            location: nextEvent.Circuit.Location.country,
            eventType: EventType.Race,
            end: nextEventRaceEnd,
        };
    }

    if (nextEventQualifyingEnd.isBefore(NOW)) {
        return {
            round: nextEventIndex + 1,
            location: nextEvent.Circuit.Location.country,
            eventType: EventType.Race,
            start: nextEventRaceStart,
        };
    }

    if (previousEventRaceEnd.isBefore(NOW)) {
        return {
            round: nextEventIndex + 1,
            location: nextEvent.Circuit.Location.country,
            eventType: EventType.Qualification,
            start: nextEventQualifyingStart,
        };
    }

    if (previousEventRaceStart.isBefore(NOW)) {
        return {
            round: nextEventIndex,
            location: previousEvent.Circuit.Location.country,
            eventType: EventType.Race,
            end: previousEventRaceEnd,
        };
    }

    if (previousEventQualifyingEnd.isBefore(NOW)) {
        return {
            round: nextEventIndex,
            location: previousEvent.Circuit.Location.country,
            eventType: EventType.Race,
            start: previousEventRaceStart,
        };
    }

    return {
        round: nextEventIndex,
        location: previousEvent.Circuit.Location.country,
        eventType: EventType.Qualification,
        end: previousEventQualifyingEnd,
    };
}

function findNextEvent(): DisplayEvent {
    const NOW = moment();
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

export function getNextEvent2(races: Race[]): Observable<DisplayEvent> {
    const nextEvent = findNextEvent2(races) as DisplayEvent;
    // Finds next event each 2 minutes
    return interval(2 * 60 * 1000).pipe(
        map(() => nextEvent),
        filter(event => event !== null),
        startWith(nextEvent),
        shareReplay(1),
    );
}

export function resultToPoints(result: PlayerRoundResult): number {
    const driversInListPts = DRIVER_IN_LIST_PTS * (result.qual_guessed_on_list.length + result.race_guessed_on_list.length);
    const driversPositionsPts = DRIVER_PLACE_PTS * (result.qual_guessed_position.length + result.race_guessed_position.length);
    const correctTeams = filterTeams(result.correct_teams);
    const correctTeamsPts = correctTeams ? CORRECT_TEAM_FROM_PAIR_PTS * correctTeams.length : 0;
    const wrongTeams = filterTeams(result.wrong_teams);
    const wrongTeamsPts = wrongTeams ? WRONG_TEAM_PTS * wrongTeams.length : 0;
    
    return driversInListPts + driversPositionsPts + correctTeamsPts + wrongTeamsPts;
}

export function toPoints(results: PlayerRoundResult[], users: User[]): UserPoints[] {
    return users.reduce((acc, user) => {
        const points = results.filter(result => result.userid === user.id)
            .reduce((sum, result) => sum + resultToPoints(result), 0);
        acc.push({user, points});
        return acc;
    }, [] as UserPoints[]).sort((left, right) => right.points - left.points);
}

export function calculateRoundPoints(roundResult: DriverRoundResult, teamVsTeamRoundResults: TeamVsTeam[], prediction: Prediction): Array<number[]|null> {
    if (!roundResult) {
        return [];
    }

    const qualifyngPredictionPoints = calculateEventPoints(roundResult.qualifying, prediction.qualification);
    const racePredictionPoints = calculateEventPoints(roundResult.race, prediction.race);
    const userCorrectTeamVsTeamPts = getCorrectTeams(prediction.team_vs_team, teamVsTeamRoundResults).length;
    const userWrongTeamVsTeamPts = getWrongTeams(prediction.team_vs_team, teamVsTeamRoundResults).length;

    return [qualifyngPredictionPoints, racePredictionPoints, [userCorrectTeamVsTeamPts, userWrongTeamVsTeamPts]];
}

function calculateEventPoints(actualDrivers: string[], predictedDrivers: string[]): number[]|null {
    if (!actualDrivers) {
        return null;
    }

    const driversInListPoints = actualDrivers.reduce((acc, actualDriver) => 
            acc + (predictedDrivers.includes(actualDriver) ? 1 : 0), 0);
    const driversPlacePoints = actualDrivers.reduce((acc, actualDriver, index) =>
        acc + (actualDriver === predictedDrivers[index] ? 1 : 0), 0);

    return [driversInListPoints, driversPlacePoints];
}

export function getFullUserName(user: User|null|undefined): string {
    return user ? user.firstname + (user.lastname ? ' ' + user.lastname : '') : '';
}

export function getShortName(fullName: string): string {
    return fullName.substring(0, 3).toLocaleUpperCase();
}

export function getIndexes(max: number): number[] {
    return Array(max).fill(0).map((x, i) => i);
}

export function getSeasonPointsPerRound(user: User): number {
    return user.seasonpoints / user.season_events_total || 0;
}

export function compare(left: number, right: number, isAsc: boolean): number {
    return (left < right ? -1 : 1) * (isAsc ? 1 : -1);
}

export function animateTextElements(selectors: string[], duration: number, delayIn: number, delayOut: number): void {
    let targetsList = selectors.map(selector => {
        let textWrapper = document.querySelector(selector)!;
        textWrapper.innerHTML = textWrapper.textContent!.replace(/\S/g, "<span class='letter' style='display:inline-block;'>$&</span>");
        return `${selector} .letter`;
    });
    
    targetsList.reduce((acc, targets) => {
        return acc.add({
            targets,
            translateX: [40, 0],
            translateZ: 0,
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration,
            delay: (el: any, index: number) => delayIn + 30 * index,
        }).add({
            targets,
            translateX: [0, -30],
            opacity: [1, 0],
            easing: 'easeInExpo',
            duration,
            delay: (el: any, index: number) => delayOut + 30 * index,
        })
    }, anime.timeline({loop: true}));
}


export function getCorrectTeams(predictedTeams: TeamName[], resultTeams: TeamVsTeam[]): TeamName[] {
    if (!predictedTeams || !resultTeams || predictedTeams.length !== resultTeams.length) {
        return [];
    }

    return predictedTeams.filter((predictedTeam, index) => 
        predictedTeam !== TeamName.None && 
            resultTeams[index].winner !== TeamName.None &&
            predictedTeam === resultTeams[index].winner);
}

export function getWrongTeams(predictedTeams: TeamName[], resultTeams: TeamVsTeam[]): TeamName[] {
    if (!predictedTeams || !resultTeams || predictedTeams.length !== resultTeams.length) {
        return [];
    }

    return predictedTeams.filter((predictedTeam, index) => 
        !!predictedTeam && predictedTeam !== TeamName.None && 
            resultTeams[index].winner !== TeamName.None && 
            predictedTeam !== resultTeams[index].winner);
}

export function filterTeams(teams: TeamName[] = []): TeamName[] {
    return (teams ?? []).filter(team => !!team && team !== TeamName.None);
}
