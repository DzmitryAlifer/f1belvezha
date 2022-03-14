import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {EChartsOption} from 'echarts';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import * as fullResultsSelectors from '../full-results/store/full-results.selectors'; 
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';


@Component({
  selector: 'charts',
  templateUrl: './charts.html',
  styleUrls: ['./charts.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartsComponent {
  private readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
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

  constructor(private readonly store: Store) {}
}

function getChartOptions(data: Array<{ name: string, value: number }>, isDarkMode: boolean): EChartsOption {
  const countryColors: any = {
    Hamilton: '#ffffff',
    Verstappen: '#dddddd',
    Bottas: '#ff0000',
  };

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
      //   color: function (param: any) {
      //     return countryColors[param.name] || '#ffee77';
      //   }
        borderColor: isDarkMode ? '#424242' : '#e0e0e0',
        borderWidth: 1,
      },
    }],
  };
} 
