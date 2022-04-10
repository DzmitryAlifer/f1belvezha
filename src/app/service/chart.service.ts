import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {EChartsOption, SeriesOption} from 'echarts';
import {combineLatest, Observable, of, timer} from 'rxjs';
import {debounceTime, filter, map, shareReplay} from 'rxjs/operators';
import {PREDICTION_PLACES_NUMBER, TEAM_DRIVER_COLORS} from 'src/constants';
import {CORRECT_TEAM_FROM_PAIR_PTS, DRIVER_IN_LIST_PTS, DRIVER_PLACE_PTS, findNextEvent2, getFullUserName, NOT_SELECTED_DRIVER_NAME, resultToPoints, WRONG_TEAM_PTS} from '../common';
import * as fullResultsSelectors from '../full-results/store/full-results.selectors';
import {DisplayEvent, EventType} from '../toolbar/next-event/next-event.component';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';
import {PlayerRoundResult, PlayerSuccessPct, Prediction, User} from '../types';


const GREY_250 = '#e7e7e7';
const GREY_400 = '#bdbdbd';
const GREY_750 = '#525252';
const BLUE_200 = '#90caf9';
const BLUE_800 = '#1565c0';


@Injectable({providedIn: 'root'})
export class ChartService {
  private readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  private readonly lastRound = this.store.select(toolbarSelectors.selectLastRound);
  private readonly users = this.store.select(fullResultsSelectors.selectUsers);
  private readonly currentUserFullName = this.store.select(toolbarSelectors.selectCurrentUser).pipe(map(user => getFullUserName(user)));
  private readonly playersYearResults = this.store.select(toolbarSelectors.selectPlayersResults);
  private readonly calendarEvents = this.store.select(toolbarSelectors.selectCalendar);
  private readonly nextEvent = combineLatest([this.calendarEvents, timer(0, 5 * 60 * 1000)]).pipe(
    filter(([calendarEvents]) => !!calendarEvents.length),
    map(([calendarEvents]) => findNextEvent2(calendarEvents)),
  );
  private readonly allPredictions = this.store.select(fullResultsSelectors.selectAllPredictions);

  private readonly driversCount = this.allPredictions.pipe(
    map(predictions => predictions.map(prediction => [...prediction.qualification, ...prediction.race]).flat()),
    map(repeatedDrivers => repeatedDrivers.reduce((driversMap, driverName) => {
      const count = driversMap.get(driverName) ?? 0;
      return driversMap.set(driverName, count + 1);
    }, new Map<string, number>())),
    map(driversMap => new Map([...driversMap.entries()].sort((left, right) => right[1] - left[1]))),
    map(driversMap => Array.from(driversMap, ([name, value]) => ({ name, value }))),
  );
  
  private readonly playersSuccessRates = combineLatest([this.users, this.allPredictions, this.playersYearResults, this.lastRound, this.nextEvent]).pipe(
    debounceTime(0),
    map(([users, allPredictions, results, lastRound, nextEvent]) => users.reduce((map, user) => {
      const userId = user.id!;
      const playerFullName = getFullUserName(user);
      const userPredictions = allPredictions.filter(prediction => prediction.userid == userId && prediction.round! <= lastRound);
      const singlePlayerResults = results.filter(result => result.userid === userId);
      const singlePlayerSuccessPct = map.get(playerFullName) ??
          {userId, correctInList: 0, correctPosition: 0, predictionsNumber: 0};
      const correctInList = singlePlayerSuccessPct.correctInList + countGettingsInList(singlePlayerResults);
      const correctPosition = singlePlayerSuccessPct.correctPosition + countCorrectPositions(singlePlayerResults);
      const predictionsNumber = this.calculateUserPredictionsNumber(userPredictions, nextEvent);

      return map.set(playerFullName, {userId, correctInList, correctPosition, predictionsNumber});
    }, new Map<string, PlayerSuccessPct>())),
    shareReplay(1),
  );

  private readonly playersProgressTotalPts = 
      combineLatest([this.users, this.playersYearResults, this.calendarEvents, this.nextEvent]).pipe(
        debounceTime(0),
        map(([users, results, calendarEvents, nextEvent]) => {
          const seriesData: {country: string, roundUserPts: number[]}[] = [];

          for (let round = 1; round < nextEvent.round; round++) {
            const country = calendarEvents.find(event => event.round === round)!.Circuit.Location.country;
            const roundUserPts = getRoundUsersPoints(round, users, results)
            seriesData.push({country, roundUserPts});
          }

          return seriesData;
        }), 
        shareReplay(1),
      );

  calculateUserPredictionsNumber(userPredictions: Prediction[], nextEvent: DisplayEvent): number {
    const allUserPredictionsCount = userPredictions 
        .filter(prediction => prediction.round && (prediction.round < nextEvent.round || prediction.round === nextEvent.round))
        .reduce((total, prediction) => {
          const hasQualifyngPrediction = prediction.qualification.some(driverName => driverName !== NOT_SELECTED_DRIVER_NAME);
          const hasRacePrediction = prediction.race.some(driverName => driverName !== NOT_SELECTED_DRIVER_NAME);
          return total + Number(hasQualifyngPrediction) + Number(hasRacePrediction);
        }, 0);
    
    const hasNextEventPrediction = userPredictions.some(prediction => 
        nextEvent.round === prediction.round  && 
        (nextEvent.eventType === EventType.Qualification && prediction.qualification.some(driverName => driverName !== NOT_SELECTED_DRIVER_NAME) || 
        nextEvent.eventType === EventType.Race && prediction.race.some(driverName => driverName !== NOT_SELECTED_DRIVER_NAME)));

    return (allUserPredictionsCount - Number(hasNextEventPrediction)) / 2;
  }

  private readonly playersCorrectInListRate = this.playersSuccessRates.pipe(
    map(playersMap => Array.from(playersMap, ([name, result]) => ({name, value: getGuessesRatio(result.correctInList, result.predictionsNumber)}))),
    map(list => list.filter(item => !!item.value).sort((left, right) => right.value - left.value)),
  );

  private readonly playersCorrectPositionRate = this.playersSuccessRates.pipe(
    map(playersMap => Array.from(playersMap, ([name, result]) => ({name, value: getGuessesRatio(result.correctPosition, result.predictionsNumber)}))),
    map(list => list.filter(item => !!item.value).sort((left, right) => right.value - left.value)),
  );

  constructor(private readonly store: Store) { this.playersProgressTotalPts.subscribe(r=>console.log(r))}

  getMostSelectableDrivers(): Observable<EChartsOption> {
    return combineLatest([this.driversCount, this.isDarkMode]).pipe(
      map(([driversCount, isDarkMode]) => getPieChartOptions(driversCount, isDarkMode, TEAM_DRIVER_COLORS)));
  }

  getCorrectInListRate(): Observable<EChartsOption> {
    return combineLatest([this.playersCorrectInListRate, this.currentUserFullName, this.isDarkMode]).pipe(
      map(([playersCorrectInListRate, currentUserFullName, isDarkMode]) => 
        getBarChartOptions(playersCorrectInListRate, currentUserFullName, isDarkMode)));
  }

  getCorrectPositionRate(): Observable<EChartsOption> {
    return combineLatest([this.playersCorrectPositionRate, this.currentUserFullName, this.isDarkMode]).pipe(
      map(([playersCorrectPositionRate, currentUserFullName, isDarkMode]) => 
        getBarChartOptions(playersCorrectPositionRate, currentUserFullName, isDarkMode)));
  }

  getPlayersProgress(): Observable<EChartsOption> {
    return combineLatest([this.playersProgressTotalPts, this.users, this.currentUserFullName, this.isDarkMode]).pipe(
      map(([playersProgressTotalPts, users, currentUserFullName, isDarkMode]) => 
        getHorizontalStackedBarChartOptions(playersProgressTotalPts, users, currentUserFullName, isDarkMode)),
    );
  }
}

function getGuessesRatio(correctGuessesNumber: number, predictionsNumber: number): number {
  return correctGuessesNumber / (2 * PREDICTION_PLACES_NUMBER * predictionsNumber) * 100;
}

function countGettingsInList(singlePlayerResults: PlayerRoundResult[]): number {
  return singlePlayerResults.reduce((sum, result) =>
    sum + result.qual_guessed_on_list.length + result.race_guessed_on_list.length, 0);
}

function countCorrectPositions(singlePlayerResults: PlayerRoundResult[]): number {
  return singlePlayerResults.reduce((sum, result) =>
    sum + result.qual_guessed_position.length + result.race_guessed_position.length, 0);
}

function getRoundUsersPoints(round: number, users: User[], results: PlayerRoundResult[]): number[] {
  const playersRoundPoints: number[] = [];

  for (let user of users) {
    const playerRoundResult = results.find(result => result.userid === user.id && result.round === round);
    const playerRoundPoints = playerRoundResult ? resultToPoints(playerRoundResult) : 0;
    playersRoundPoints.push(playerRoundPoints);
  }

  return playersRoundPoints;
}

export function getPieChartOptions(data: Array<{ name: string, value: number }>, isDarkMode: boolean, customColors?: any): EChartsOption {
  return {
    tooltip: {trigger: 'item'},
    series: {
      type: 'pie',
      colorBy: 'data',
      data,
      emphasis: {
        itemStyle: {
          shadowBlur: 3,
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      itemStyle: {
        color: customColors ? ({name}: any) => customColors[name] : undefined,
        borderColor: isDarkMode ? '#424242' : '#e0e0e0',
        borderWidth: 1,
      },
    },
  };
}

export function getBarChartOptions(data: Array<{name: string, value: number}>, currentUserFullName: string, isDarkMode: boolean): EChartsOption {
  const currentUserColor = isDarkMode ? BLUE_200 : BLUE_800;
  const labelColor = isDarkMode ? GREY_400 : GREY_750;
  const gridColor = isDarkMode ? GREY_750 : GREY_250;
  const names = data.map(({name}) => name);
  const values = data.map(({value}) => Math.round(value));
  const min = Math.min(...values);
  const yAxisMin = Math.max(0, min % 10 ? Math.floor(min / 10) * 10 : min - 10);
  const max = Math.max(...values);

  return {
    grid: {bottom: 90, left: 50},
    xAxis: {
      type: 'category',
      data: names,
      axisLabel: {
        interval: 0,
        rotate: 40,
        color: (value: any): any => value === currentUserFullName ? currentUserColor : labelColor,
      },
    },
    yAxis: {
      type: 'value',
      min: yAxisMin,
      max,
      splitLine: {lineStyle: {color: gridColor}},
    },
    series: {type: 'bar', data: values},
  };
}

function getHorizontalStackedBarChartOptions(playersPtsByCountries: {country: string, roundUserPts: number[]}[], users: User[], currentUserFullName: string, isDarkMode: boolean): EChartsOption {
  const currentUserColor = isDarkMode ? BLUE_200 : BLUE_800;
  const labelColor = isDarkMode ? GREY_400 : GREY_750;
  const gridColor = isDarkMode ? GREY_750 : GREY_250;
  const usersAxisLabels = users.map(user => getFullUserName(user)).slice().reverse();
  const series: SeriesOption[] = playersPtsByCountries.map(countryPlayersPts => ({
    type: 'bar',
    stack: 'total',
    label: {show: true},
    emphasis: {focus: 'series'},
    name: countryPlayersPts.country,
    data: countryPlayersPts.roundUserPts.slice().reverse(),
  }));
  
  return {
    tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
    legend: {textStyle: {color: labelColor}},
    grid: {top: 36, left: 6, bottom: -2, right: 16, containLabel: true},
    xAxis: {
      type: 'value',
      splitLine: {lineStyle: {color: gridColor}},
    },
    yAxis: {
      type: 'category',
      data: usersAxisLabels,
      axisLabel: {color: (value: any): any => value === currentUserFullName ? currentUserColor : labelColor},
    },
    series,
  };
}
