export interface User {
    username: string;
    firstname: string;
    id?: number;
    lastname?: string;
    password?: string;
    seasonpoints: number;
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

export interface DriverStandingsResponse {
    MRData: {
        StandingsTable: {
            StandingsLists: Standings[];
        };
    };
}

export interface Standings {
    DriverStandings: DriverStanding[];
}

export interface Race {
    round: number;
    Circuit: {
        Location: {
            country: string;
        };
    };
    date: string;
    QualifyingResults?: Result[];
    Results?: Result[];
}

export interface Team {
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
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

export interface DriverStanding {
    position: number;
    points: number;
    wins: number;
    Driver: Driver;
}

export interface Params {
    [param: string]: string;
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

export interface ResultDb {
    id: number;
    year: number;
    round: number;
    qualifying: string[];
    race: string[];
}
