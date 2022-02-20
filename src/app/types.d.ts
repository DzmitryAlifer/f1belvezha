export interface User {
    id: number;
    username: string;
    firstname: string;
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