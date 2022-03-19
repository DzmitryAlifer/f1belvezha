import {CdkDragEnd} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store'; 
import {LocalStorageService} from './service/local-storage.service';
import {DropPoint} from './types';
import * as toolbarSelectors from './toolbar/store/toolbar.selectors';
import {Page} from './enums';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly Page = Page;
  
  readonly currentUser = this.store.select(toolbarSelectors.selectCurrentUser);
  readonly isLockedLayout = this.store.select(toolbarSelectors.selectIsLockedLayout);
  readonly page = this.store.select(toolbarSelectors.selectPage);

  readonly savedUserStandingPosition = 
      this.localStorageService.getItem<DropPoint>('dropPointUserStanding') ?? {x: 0, y: 0};

  readonly savedDriverStandingPosition =
    this.localStorageService.getItem<DropPoint>('dropPointDriverStanding') ?? { x: 0, y: 0 };

  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly store: Store,
  ) {}

  saveUserStandingsPosition(event: CdkDragEnd): void {
    const dragPosition: DropPoint = event.source.getFreeDragPosition();
    this.localStorageService.setItem('dropPointUserStanding', dragPosition);
  }

  saveDriverStandingsPosition(event: CdkDragEnd): void {
    const dragPosition: DropPoint = event.source.getFreeDragPosition();
    this.localStorageService.setItem('dropPointDriverStanding', dragPosition);
  }
}
