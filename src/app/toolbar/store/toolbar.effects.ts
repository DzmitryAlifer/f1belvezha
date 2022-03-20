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
import {DriverRoundResult, PlayerRoundResult, Prediction} from 'src/app/types';


const CURRENT_YEAR = new Date().getFullYear();


@Injectable()
export class ToolbarEffects {
    private readonly language = this.store.select(toolbarSelectors.selectLanguage);
    private readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
    private readonly isLockedLayout = this.store.select(toolbarSelectors.selectIsLockedLayout);
    private readonly users = this.store.select(fullResultsSelectors.selectUsers);
    private readonly driverResults = this.store.select(fullResultsSelectors.selectCurrentYearResults);
    private readonly playersResults = this.resultService.getPlayersYearResults(CURRENT_YEAR);
    private readonly allPredictions = this.predictionService.getAllPredictions();

    private readonly unprocessedDriversResults = combineLatest([this.driverResults, this.playersResults]).pipe(
        debounceTime(0),
        map(([driverResults, playersResults]) =>
            driverResults.filter(driverResult =>
                !playersResults.some(playersResult => playersResult.round === driverResult.round))));

    private readonly newPlayersResults = combineLatest([this.unprocessedDriversResults, this.allPredictions]).pipe(
        map(([driverResults, predictions]) =>
            driverResults.map(driverResult =>
                predictions.filter(({ round }) => round === driverResult.round).map(prediction =>
                    getPlayerResult(prediction, driverResult))).flat()));

    constructor(
        private actions: Actions<ToolbarAction>,
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

    getPlayersYearResults = createEffect(() => this.actions.pipe(
        ofType(ToolbarActionType.LOAD_PLAYERS_RESULTS),
        switchMap(() => combineLatest([this.newPlayersResults, this.users]).pipe(
            switchMap(([playersResults, users]) => this.resultService.addPlayersResults(playersResults).pipe(
                tap(playersResults => {
                    this.userService.updateUserPoints(playersResults, users)/*.subscribe()*/;
                }),
                switchMap(() => this.resultService.getPlayersYearResults(CURRENT_YEAR)),
                map(playersResults => ({type: ToolbarActionType.LOAD_PLAYERS_RESULTS_SUCCESS, payload: {playersResults}})),
            )),
        )),
    ));
}

function getPlayerResult(prediction: Prediction, { year, round, qualifying, race }: DriverRoundResult): PlayerRoundResult {
    return {
        userid: prediction.userid!,
        year,
        round,
        qual_guessed_on_list: intersection(prediction.qualification, qualifying),
        qual_guessed_position: getSamePlaces(prediction.qualification, qualifying),
        race_guessed_on_list: intersection(prediction.race, race ?? []),
        race_guessed_position: getSamePlaces(prediction.race, race ?? []),
    };
}

function intersection(left: string[], right: string[]): string[] {
    return left.filter(element => right.includes(element));
}

function getSamePlaces(left: string[], right: string[]): string[] {
    return left.filter((element, index) => right.indexOf(element) === index);
}
