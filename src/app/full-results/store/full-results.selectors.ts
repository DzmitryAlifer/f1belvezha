import {createFeatureSelector, createSelector} from '@ngrx/store';
import {FullResultsState} from './full-results.model';
import {DriverRoundResult, User} from 'src/app/types';
import {CORRECT_TEAM_FROM_PAIR_PTS, DRIVER_IN_LIST_PTS, DRIVER_PLACE_PTS, WRONG_TEAM_PTS} from 'src/app/common';


export const selectFullResultsState = createFeatureSelector<FullResultsState>('fullResults');
const selectFullResults = createSelector(selectFullResultsState, (state: FullResultsState) => state);
export const selectIsLoaded = createSelector(selectFullResults,(state: FullResultsState) => state.isLoaded);
export const selectNextRound = createSelector(selectFullResults, (state: FullResultsState) => state.nextRound);
export const selectRaces = createSelector(selectFullResults, (state: FullResultsState) => state.races);
export const selectUsers = createSelector(selectFullResults, (state: FullResultsState) => state.users);
export const selectUsernames = createSelector(selectUsers, (users: User[]) => users.map(({username}) => username));
export const selectNextRaceTeamVsTeamList = createSelector(selectFullResults, (state: FullResultsState) => state.nextRaceTeamVsTeamList);
export const selectCurrentYearTeamVsTeamList = createSelector(selectFullResults, (state: FullResultsState) => state.yearTeamVsTeamList);
export const selectCurrentYearResults = createSelector(selectFullResults, (state: FullResultsState) => state.currentYearDriverResults);
export const selectAllPredictions = createSelector(selectFullResults, (state: FullResultsState) => state.predictions);
export const selectCurrentUserPredictions = createSelector(selectFullResults,(state: FullResultsState) => state.currentUserPredictions);
export const selectNextRoundPredictions = createSelector(selectFullResults, (state: FullResultsState) => state.nextRoundPredictions);
export const selectCurrentYearPoints = createSelector(selectFullResults, (state: FullResultsState) => state.currentYearPoints);

export const selectCurrentYearPointsSum = 
    createSelector(selectCurrentYearPoints, (currentYearPoints: Map<number, Map<number, number[][]>>) => {
        return Array.from(currentYearPoints.entries()).reduce((map, [userId, roundToValuesMap]) => {
            const roundToPointsMap = convertToPointsMap(roundToValuesMap);
            map.set(userId, roundToPointsMap);
            return map;
        }, new Map<number, Map<number, number>>());
});

function convertToPointsMap(roundToValuesMap: Map<number, number[][]>): Map<number, number> {
    return Array.from(roundToValuesMap.entries()).reduce((map, [round, values]) => {
        const qualifyingPts = values[0][0] * DRIVER_IN_LIST_PTS + values[0][1] * DRIVER_PLACE_PTS;
        const racePts = values[1][0] * DRIVER_IN_LIST_PTS + values[1][1] * DRIVER_PLACE_PTS;
        const teamVsTeamPts = values[2][0] * CORRECT_TEAM_FROM_PAIR_PTS + values[2][1] * WRONG_TEAM_PTS;
        map.set(round, qualifyingPts + racePts + teamVsTeamPts);
        return map;
    }, new Map<number, number>());
}

export const selectAllRoundWinners = createSelector(selectCurrentYearPointsSum, selectCurrentYearResults, selectUsers, 
    (currentYearPointsSum: Map<number, Map<number, number>>, currentYearResults: DriverRoundResult[], users: User[]) => {
        const lastRound = currentYearResults.length ? currentYearResults[currentYearResults.length - 1].round : 0;

        return Array.from(currentYearPointsSum.entries()).reduce((map, [userId, roundToUserPts]) => {
            for (let round = 1; round <= lastRound; round++) {
                const roundWinnersPts = map.get(round)
                const userRoundPts = roundToUserPts.get(round);
                const user = users.find(user => user.id! === userId)!;

                if (!userRoundPts) {
                    return map;
                }

                if (!roundWinnersPts || userRoundPts > (roundWinnersPts.maxPoints ?? 0)) {
                    map.set(round, {maxPoints: userRoundPts, winners: [user]});
                }

                if (userRoundPts === roundWinnersPts?.maxPoints) {
                    roundWinnersPts.winners.push(user);
                }
            }
            return map;
        }, new Map<number, {maxPoints: number, winners: User[]}>());
});