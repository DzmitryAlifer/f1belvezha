export interface User {
    username: string;
    firstname: string;
    id?: number;
    lastname?: string;
    password?: string;
}

export interface Season {
    MRData: {
        RaceTable: {
            Races: Race[];
        };
    };
}

export interface Race {
    round: string;
    Circuit: {
        Location: {
            country: string;
        };
    };
    date: string;
}

export interface Params {
    [param: string]: string;
}

export interface DropPoint {
    x: number;
    y: number;
}
