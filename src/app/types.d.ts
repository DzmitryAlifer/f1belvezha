import {EventType, TeamName} from './enums';


declare module '/animejs/lib/anime.es.js';

export interface User {
    username: string;
    firstname: string;
    id?: number;
    lastname?: string;
    password?: string;
    seasonpoints: number;
    season_events_total: number;
    avatar?: File;
    admin?: boolean;
}

export interface RacesResponse {
    MRData: {
        RaceTable: {
            Races: Race[];
        };
    };
}

export interface DriversResponse {
    MRData: {
        DriverTable: {
            Drivers: Driver[];
        };
    };
}

export interface TeamsResponse {
    MRData: {
        ConstructorTable: {
            Constructors: Team[];
        };
    };
}

export interface StandingsResponse {
    MRData: {
        StandingsTable: {
            StandingsLists: (DriverStandings|ConstructorStandings)[];
        };
    };
}

export interface DriverStandings {
    DriverStandings: DriverStanding[];
}

export interface ConstructorStandings {
    ConstructorStandings: ConstructorStanding[];
}

export interface DateTimeApi {
    date: string;
    time: string;
}

export interface Race {
    season: number;
    round: number;
    raceName: string;
    Circuit: {
        Location: {
            country: string;
        };
    };
    FirstPractice: DateTimeApi;
    SecondPractice: DateTimeApi;
    ThirdPractice: DateTimeApi;
    Qualifying: DateTimeApi;
    Sprint: DateTimeApi;
    date: string;
    time: string;
    QualifyingResults?: DriverStanding[];
    Results?: DriverStanding[];
}

export interface Team {
    constructorId: TeamName;
    url: string;
    name: string;
    nationality: string;
}

export interface TeamVsTeam {
    year: number;
    round: number;
    teams: TeamName[];
    winner?: TeamName;
}

export interface Driver {
    driverId: string;
    permanentNumber: number;
    code: string;
    url: string;
    givenName: string;
    familyName: string;
    dateOfBirth: string;
    nationality: string;
    constructorId?: string;
}

export interface Standing {
    position: number;
    points: number;
    wins: number;
}

export interface DriverStanding extends Standing {
    Driver: Driver;
}

export interface ConstructorStanding extends Standing {
    Constructor: Team;
}

export interface Params {
    [param: string]: string | number;
}

export interface DropPoint {
    x: number;
    y: number;
}

export interface Prediction {
    id?: number;
    userid?: number;
    round?: number;
    qualification: string[];
    race: string[];
    team_vs_team: TeamName[];
}

export interface CountDownDigits {
    daysDigits: string;
    hoursDigits: string;
    minutesDigits: string;
    secondsDigits: string;
}

export interface ResultsResponse {
    MRData: {
        RaceTable: {
            Races: Race[];
        }
    };
}

export interface Result {
    position: number;
    Driver: Driver;
}

export interface DriverRoundResult {
    id?: number;
    year: number;
    round: number;
    qualifying: string[];
    race: string[];
}

export interface PlayerRoundResult {
    userid: number;
    year: number;
    round: number;
    qual_guessed_on_list: string[];
    qual_guessed_position: string[];
    race_guessed_on_list: string[];
    race_guessed_position: string[];
    correct_teams?: TeamName[];
    wrong_teams?: TeamName[];
}

export interface UserPoints {
    user: User;
    points: number;
}

export interface NewsResponse {
    rss: {
        channel: [{item: RssNews[]}];
    }
}

export interface RssNews {
    guid: {_: string}[];
    title: string[];
    link: string[];
    description: string[];
    pubDate: string[];
    enclosure: {$: {url: string}}[];
}

export interface News {
    guid: number;
    title: string;
    link: string;
    description: string;
    pubDate: Date;
    enclosure: string;
}

export interface PlayerSuccessPct {
    userId: number;
    correctInList: number;
    correctPosition: number;
    predictionsNumber: number;
}

export interface EventSchedule {
    location: string;
    qualification: DateRange;
    race: DateRange;
}

export interface DisplayEvent {
    round: number;
    location: string;
    eventType: EventType;
    start?: moment.Moment;
    end?: moment.Moment;
}

export interface DateRange {
    start: moment.Moment;
    end: moment.Moment;
}