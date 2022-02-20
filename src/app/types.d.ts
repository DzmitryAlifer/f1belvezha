export interface User {
    id: number;
    username: string;
    firstname: string;
    lastname?: string;
}

export interface Races {
    MRData: {
        RaceTable: {
            Races: Race[];
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