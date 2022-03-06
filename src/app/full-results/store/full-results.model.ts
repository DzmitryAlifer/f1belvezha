import {Prediction, Race, User} from 'src/app/types';

export interface FullResultsState {
    columns: string[];
    currentUser: User | null;
    currentUserPredictions: Prediction[];
    isAuthenticated: boolean;
    isLoaded: boolean;
    nextRound: number;
    predictions: Prediction[];
    races: Race[];
    users: User[];
}
