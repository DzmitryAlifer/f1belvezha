import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {debounceTime, map, switchMap, tap} from 'rxjs/operators';
import {Theme, ThemeService} from 'src/app/service/theme.service';
import {ToolbarAction, ToolbarActionType} from './toolbar.actions';
import * as toolbarSelectors from './toolbar.selectors';
import * as fullResultsSelectors from '../../full-results/store/full-results.selectors';
import {PredictionService} from '../../service/prediction.service';
import {ResultService} from '../../service/result.service';
import {UserService} from '../../service/user.service';
import {DriverRoundResult, PlayerRoundResult, Prediction, TeamVsTeam} from 'src/app/types';
import {F1PublicApiService} from '../../service/f1-public-api.service';
import { TeamName } from 'src/app/enums';


const CURRENT_YEAR = new Date().getFullYear();


@Injectable()
export class ToolbarEffects {
    private readonly language = this.store.select(toolbarSelectors.selectLanguage);
    private readonly startPage = this.store.select(toolbarSelectors.selectStartPage);
    private readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
    private readonly isLockedLayout = this.store.select(toolbarSelectors.selectIsLockedLayout);
    private readonly lastRound = this.store.select(toolbarSelectors.selectLastRound);
    private readonly users = this.store.select(fullResultsSelectors.selectUsers);
    private readonly driverResults = this.store.select(fullResultsSelectors.selectCurrentYearResults);
    private readonly teamVsTeamResults = this.store.select(fullResultsSelectors.selectCurrentYearTeamVsTeamList);
    private readonly playersResults = this.resultService.getPlayersYearResults(CURRENT_YEAR);
    private readonly allPredictions = this.predictionService.getAllPredictions();
    private readonly calendar = this.f1PublicApiService.getCurrentCalendar();

    private readonly lastRoundCalculated = this.driverResults.pipe(
        map(driverResults => {
            const currentYearSortedResults = driverResults.filter(driverResult => driverResult.year === CURRENT_YEAR)
                    .sort((left, right) => right.round - left.round);
            return currentYearSortedResults.length ? currentYearSortedResults[0].round : 0;
        }));

    private readonly unprocessedDriversResults = combineLatest([this.driverResults, this.playersResults]).pipe(
        debounceTime(0),
        map(([driverResults, playersResults]) =>
            driverResults.filter(driverResult =>
                !playersResults.some(playersResult => playersResult.round === driverResult.round))));

    private readonly unprocessedTeamVsTeamResults = combineLatest([this.teamVsTeamResults, this.playersResults]).pipe(
        debounceTime(0),
        map(([teamVsTeamResults, playersResults]) =>
            teamVsTeamResults.filter(teamVsTeamResult =>
                !playersResults.some(playersResult => playersResult.round === teamVsTeamResult.round))));

    private readonly newPlayersResults = 
        combineLatest([this.unprocessedDriversResults, this.unprocessedTeamVsTeamResults, this.allPredictions]).pipe(
            map(([driverResults, teamVsTeamResults, predictions]) => {
                const playerDriverResults =  driverResults.map(driverResult => {
                    const teamVsTeamRoundResults = teamVsTeamResults.filter(({round}) => round === driverResult.round);
                    return predictions.filter(({round}) => round === driverResult.round).map(prediction => getPlayerResult(prediction, driverResult, teamVsTeamRoundResults));
                }).flat();

                return playerDriverResults;
            }),
        );

    constructor(
        private actions: Actions<ToolbarAction>,
        private readonly f1PublicApiService: F1PublicApiService,
        private readonly store: Store,
        private readonly predictionService: PredictionService,
        private readonly resultService: ResultService,
        private themeService: ThemeService,
        private readonly userService: UserService,
    ) {}

    setLanguage = createEffect(() => this.actions.pipe(
        ofType(ToolbarActionType.SET_LANGUAGE),
        switchMap(() => this.language.pipe(
            tap(language => {
                localStorage.setItem('language', language);
            }),
            map(() => ({type: ToolbarActionType.SET_LANGUAGE_SUCCESS})),
        )),
    ));

    setStartPage = createEffect(() => this.actions.pipe(
        ofType(ToolbarActionType.SET_START_PAGE),
        switchMap(() => this.startPage.pipe(
            tap(startPage => {
                localStorage.setItem('startPage', startPage);
            }),
            map(() => ({type: ToolbarActionType.SET_START_PAGE_SUCCESS})),
        )),
    ));

    setTheme = createEffect(() => this.actions.pipe(
        ofType(ToolbarActionType.SET_DARK_MODE),
        switchMap(() => this.isDarkMode.pipe(
            tap(isDarkMode => {
                this.themeService.update(isDarkMode ? Theme.Dark : Theme.Light);
            }),
            map(() => ({type: ToolbarActionType.SET_DARK_MODE_SUCCESS})),
        )),
    ));

    setLockedLayout = createEffect(() => this.actions.pipe(
        ofType(ToolbarActionType.SET_LOCKED_LAYOUT),
        switchMap(() => this.isLockedLayout.pipe(
            tap(isLockedLayout => {
                localStorage.setItem('layout', isLockedLayout ? 'locked' : 'unlocked');
            }),
            map(() => ({type: ToolbarActionType.SET_LOCKED_LAYOUT_SUCCESS})),
        )),
    ));

    setCalendar = createEffect(() => this.actions.pipe(
        ofType(ToolbarActionType.LOAD_CALENDAR),
        switchMap(() => this.calendar.pipe(
            map(calendar => ({type: ToolbarActionType.LOAD_CALENDAR_SUCCESS, payload: {calendar}})),
        )),
    ));

    setLastRound = createEffect(() => this.actions.pipe(
        ofType(ToolbarActionType.SET_LAST_ROUND),
        switchMap(() => this.lastRoundCalculated.pipe(
            map(lastRound => ({type: ToolbarActionType.SET_LAST_ROUND_SUCCESS, payload: {lastRound}})),
        )),
    ));

    getPlayersYearResults = createEffect(() => this.actions.pipe(
        ofType(ToolbarActionType.LOAD_PLAYERS_RESULTS),
        switchMap(() => combineLatest([this.newPlayersResults, this.allPredictions, this.lastRound, this.users]).pipe(
            debounceTime(0),
            switchMap(([playersResults, predictions, lastRound, users]) => this.resultService.addPlayersResults(playersResults).pipe(
                switchMap(() => this.resultService.getPlayersYearResults(CURRENT_YEAR)),
                tap(playersResults => {
                    this.userService.updateUserPoints(playersResults, predictions, lastRound, users).subscribe();
                }),
                map(playersResults => ({type: ToolbarActionType.LOAD_PLAYERS_RESULTS_SUCCESS, payload: {playersResults}})),
            )),
        )),
    ));
}

function getPlayerResult(prediction: Prediction, {year, round, qualifying, race}: DriverRoundResult, teamVsTeamRoundResults: TeamVsTeam[]): PlayerRoundResult {
    return {
        userid: prediction.userid!,
        year,
        round,
        qual_guessed_on_list: intersection(prediction.qualification, qualifying),
        qual_guessed_position: getSamePlaces(prediction.qualification, qualifying),
        race_guessed_on_list: intersection(prediction.race, race ?? []),
        race_guessed_position: getSamePlaces(prediction.race, race ?? []),
        correct_teams: getCorrectTeams(prediction.team_vs_team, teamVsTeamRoundResults),
        wrong_teams: getWrongTeams(prediction.team_vs_team, teamVsTeamRoundResults),
    };
}

function intersection(left: string[], right: string[]): string[] {
    return left.filter(element => right.includes(element));
}

function getSamePlaces(left: string[], right: string[]): string[] {
    return left.filter((element, index) => right.indexOf(element) === index);
}

function getCorrectTeams(predictedTeams: TeamName[], resultTeams: TeamVsTeam[]): TeamName[] {
    return [];
}

function getWrongTeams(predictedTeams: TeamName[], resultTeams: TeamVsTeam[]): TeamName[] {
    return [];
}
