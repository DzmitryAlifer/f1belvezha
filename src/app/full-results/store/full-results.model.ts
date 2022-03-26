import {DriverRoundResult, Prediction, Race, TeamVsTeamProposal, User} from 'src/app/types';


export interface FullResultsState {
    columns: string[];
    currentUser: User | null;
    currentUserPredictions: Prediction[];
    currentYearPoints: Map<number, Map<number, number[][]>>;
    currentYearResults: DriverRoundResult[];
    isAuthenticated: boolean;
    isLoaded: boolean;
    nextRaceTeamVsTeamProposals: TeamVsTeamProposal[];
    nextRound: number;
    nextRoundPredictions: Prediction[];
    predictions: Prediction[];
    races: Race[];
    users: User[];
}
