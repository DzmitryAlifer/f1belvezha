import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {FullResultsActionType} from '../full-results/store/full-results.actions';
import {ChartService} from '../service/chart.service';


@Component({
  selector: 'charts',
  templateUrl: './charts.html',
  styleUrls: ['./charts.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartsComponent implements OnInit {
  readonly mostSelectableDrivers = this.chartService.getMostSelectableDrivers();
  readonly correctInListRate = this.chartService.getCorrectInListRate();
  readonly correctPositionRate = this.chartService.getCorrectPositionRate();
  readonly playersProgress = this.chartService.getPlayersProgress();

  constructor(
    private readonly chartService: ChartService,
    private readonly store: Store,
  ) {}

  ngOnInit(): void {
    this.store.dispatch({type: FullResultsActionType.LOAD_ALL_PREDICTIONS});
    this.store.dispatch({type: FullResultsActionType.LOAD_CURRENT_YEAR_RESULTS});
  }
}

