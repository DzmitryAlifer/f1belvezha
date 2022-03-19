import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {EChartsOption} from 'echarts';
import {combineLatest} from 'rxjs';
import {debounceTime, map, shareReplay} from 'rxjs/operators';
import {PREDICTION_PLACES_NUMBER, TEAM_DRIVER_COLORS} from 'src/constants';
import {getNextEvent} from '../common';
import * as fullResultsSelectors from '../full-results/store/full-results.selectors'; 
import { EventType } from '../toolbar/next-event/next-event.component';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';
import {PlayerRoundResult} from '../types';


interface PlayerSuccessPct {
  userId: number;
  correctInList: number;
  correctPosition: number;
  predictionsNumber: number;
}


@Component({
  selector: 'charts',
  templateUrl: './charts.html',
  styleUrls: ['./charts.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartsComponent {
  private readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  private readonly users = this.store.select(fullResultsSelectors.selectUsers);
  private readonly playersYearResults = this.store.select(toolbarSelectors.selectPlayersResults);
  private readonly allPredictions = this.store.select(fullResultsSelectors.selectAllPredictions);
  private readonly nextEvent = getNextEvent();

  private readonly driversCount = this.allPredictions.pipe(
    map(predictions => predictions.map(prediction => [...prediction.qualification, ...prediction.race]).flat()),
    map(repeatedDrivers => repeatedDrivers.reduce((driversMap, driverName) => {
      const count = driversMap.get(driverName) ?? 0;
      return driversMap.set(driverName, count + 1);
    }, new Map<string, number>())),
    map(driversMap => new Map([...driversMap.entries()].sort((left, right) => right[1] - left[1]))),
    map(driversMap => Array.from(driversMap, ([name, value]) => ({name, value}))),
  );

  private readonly playersSuccessRates = combineLatest([this.users, this.allPredictions, this.playersYearResults]).pipe(
    debounceTime(0),
    map(([users, allPredictions, results]) => users.reduce((map, user) => {
      const userId = user.id!;
      const playerFullName = user.firstname + (user.lastname ? ' ' + user.lastname : '');
      const predictionsNumber = allPredictions.filter(prediction => prediction.userid == userId).length;
      const singlePlayerResults = results.filter(result => result.userid === userId);
      const singlePlayerSuccessPct = map.get(playerFullName) ?? 
          {userId, correctInList: 0, correctPosition: 0, predictionsNumber: 0};
      return map.set(playerFullName, {
        userId,
        correctInList: singlePlayerSuccessPct.correctInList + countGettingsInList(singlePlayerResults),
        correctPosition: singlePlayerSuccessPct.correctPosition + countCorrectPositions(singlePlayerResults),
        predictionsNumber: singlePlayerSuccessPct.predictionsNumber + predictionsNumber,
      });
    }, new Map<string, PlayerSuccessPct>())),
    shareReplay(1),
  );

  private readonly playersCorrectInListRate = combineLatest([this.playersSuccessRates, this.nextEvent]).pipe(
    debounceTime(0),
    map(([playersMap, nextEvent]) => Array.from(playersMap, ([name, result]) => {
      const fullRoundsCount = nextEvent.eventType === EventType.Race ? (nextEvent.round + 1) : nextEvent.round;
      const eventsCount = PREDICTION_PLACES_NUMBER * 2 * fullRoundsCount;
      const value = result.correctInList * eventsCount / result.predictionsNumber;
      return ({name, value});
    })),
    map(list => list.filter(item => !!item.value).sort((left, right) => right.value - left.value)),
  );

  private readonly playersCorrectPositionRate = this.playersSuccessRates.pipe(
    map(playersMap => Array.from(playersMap, ([name, value]) =>
        ({name, value: value.correctPosition * PREDICTION_PLACES_NUMBER * 2 / value.predictionsNumber}))),
    map(list => list.filter(item => !!item.value).sort((left, right) => right.value - left.value)),
  );

  readonly chartOptions1 = combineLatest([this.driversCount, this.isDarkMode]).pipe(
    map(([driversCount, isDarkMode]) => getPieChartOptions(driversCount, isDarkMode, TEAM_DRIVER_COLORS)));

  readonly chartOptions2 = combineLatest([this.playersCorrectInListRate, this.isDarkMode]).pipe(
    map(([playersCorrectInListRate, isDarkMode]) => getBarChartOptions(playersCorrectInListRate, isDarkMode)));  

  readonly chartOptions3 = combineLatest([this.playersCorrectPositionRate, this.isDarkMode]).pipe(
    map(([playersCorrectInListRate, isDarkMode]) => getBarChartOptions(playersCorrectInListRate, isDarkMode)));  

  constructor(private readonly store: Store) {}
}

function countGettingsInList(singlePlayerResults: PlayerRoundResult[]): number {
  return singlePlayerResults.reduce((sum, result) => 
      sum + result.qual_guessed_on_list.length + result.race_guessed_on_list.length, 0);
}

function countCorrectPositions(singlePlayerResults: PlayerRoundResult[]): number {
  return singlePlayerResults.reduce((sum, result) =>
      sum + result.qual_guessed_position.length + result.race_guessed_position.length, 0);
}

function getPieChartOptions(data: Array<{name: string, value: number}>, isDarkMode: boolean, customColors?: any): EChartsOption { 
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

function getBarChartOptions(data: Array<{name: string, value: number}>, isDarkMode: boolean): EChartsOption {
  return {
    xAxis: {
      type: 'category',
      data: data.map(({name}) => name),
      axisLabel: {interval: 0, rotate: 40},
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          color: isDarkMode ? '#525252' : '#e7e7e7',
        }
      }
    },
    series: {
      type: 'bar',
      data: data.map(({value}) => value),
    },  
  };
} 
