import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {EChartsOption} from 'echarts';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {TEAM_DRIVER_COLORS} from 'src/constants';
import * as fullResultsSelectors from '../full-results/store/full-results.selectors'; 
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';


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
  
  private readonly driversCount = this.allPredictions.pipe(
    map(predictions => predictions.map(prediction => [...prediction.qualification, ...prediction.race]).flat()),
    map(repeatedDrivers => repeatedDrivers.reduce((driversMap, driverName) => {
      const count = driversMap.get(driverName) ?? 0;
      return driversMap.set(driverName, count + 1);
    }, new Map<string, number>())),
    map(driversMap => new Map([...driversMap.entries()].sort((left, right) => right[1] - left[1]))),
    map(driversMap => Array.from(driversMap, ([name, value]) => ({name, value}))),
  );

  readonly chartOptions = combineLatest([this.driversCount, this.isDarkMode]).pipe(
    map(([driversCount, isDarkMode]) => getChartOptions(driversCount, isDarkMode)));

  // readonly chartOptions2 = combineLatest([this.users, this.playersYearResults]).pipe(
  //   map(([users, results]) => users.reduce((map, user) => {
  //     const userId = user.id!;
  //     const singlePlayerResults = results.filter(result => result.userid === userId);
  //     const singlePlayerSuccessPct = map.get(userId) ?? 
  //         {userId, correctInList: 0, correctPosition: 0, predictionsNumber: 0};
  //     map.set(userId, {
  //       userId,
  //       correctInList: singlePlayerSuccessPct.correctInList + singlePlayerResults.find(),
  //       correctPosition: 0,
  //       predictionsNumber: 0,
  //     });
      
  //     return map;
  //   }, new Map<number, PlayerSuccessPct>())),
  // );

  constructor(private readonly store: Store) {}
}

function getChartOptions(data: Array<{ name: string, value: number }>, isDarkMode: boolean): EChartsOption {
  return {
    tooltip: {trigger: 'item'},
    series: [{
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
        color: (param: any) => TEAM_DRIVER_COLORS[param.name] || '#5470c6',
        borderColor: isDarkMode ? '#424242' : '#e0e0e0',
        borderWidth: 1,
      },
    }],
  };
} 
