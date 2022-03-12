import {Prediction, Race, ResultDb, User} from 'src/app/types';

export interface FullResultsState {
    columns: string[];
    currentUser: User | null;
    currentUserPredictions: Prediction[];
    currentYearResults: ResultDb[];
    isAuthenticated: boolean;
    isLoaded: boolean;
    nextRound: number;
    nextRoundPredictions: Prediction[];
    predictions: Prediction[];
    races: Race[];
    users: User[];
}
