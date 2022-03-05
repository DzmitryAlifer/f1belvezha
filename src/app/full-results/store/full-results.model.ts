import {Prediction, Race, User} from 'src/app/types';

export interface FullResultsState {
    columns: string[];
    currentUser: User | null;
    currentUserPrediction: Prediction | null;
    isAuthenticated: boolean;
    isLoaded: boolean;
    nextRound: number;
    races: Race[];
    users: User[];
}
