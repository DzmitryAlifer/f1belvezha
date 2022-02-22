export interface User {
    username: string;
    firstname: string;
    id?: number;
    lastname?: string;
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