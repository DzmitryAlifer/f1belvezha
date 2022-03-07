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

export interface Race {
    round: number;
    Circuit: {
        Location: {
            country: string;
        };
    };
    date: string;
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
