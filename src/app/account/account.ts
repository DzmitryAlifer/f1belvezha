import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {combineLatest} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import * as fullResultsSelectors from '../full-results/store/full-results.selectors';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';


@Component({
  selector: 'app-account',
  templateUrl: './account.html',
  styleUrls: ['./account.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {
  readonly displayedColumns = [];
  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly currentUser = this.store.select(toolbarSelectors.selectCurrentUser);
  private readonly playersResults = this.store.select(toolbarSelectors.selectPlayersResults);
  private readonly allPredictions = this.store.select(fullResultsSelectors.selectAllPredictions);

  readonly currentUserPredictions = combineLatest([this.currentUser, this.allPredictions]).pipe(
    debounceTime(0),
    map(([currentUser, allPredictions]) => 
      allPredictions.filter(prediction => prediction.userid == currentUser?.id)
        .sort((left, right) => (left.round ?? 0) - (right.round ?? 0))));

  readonly currentUserResults = combineLatest([this.currentUser, this.playersResults]).pipe(
    debounceTime(0),
    map(([currentUser, playersResults]) => 
      playersResults.filter(playersResult => playersResult.userid == currentUser?.id)
        .sort((left, right) => (left.round ?? 0) - (right.round ?? 0))));
  
  constructor(private readonly store: Store) {
    this.currentUserPredictions.subscribe(r=>console.log(r));
    this.currentUserResults.subscribe(r=>console.log(r));
  }
}
