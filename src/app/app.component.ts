import {CdkDragEnd} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store'; 
import {LocalStorageService} from './service/local-storage.service';
import {DropPoint} from './types';
import * as toolbarSelectors from './toolbar/store/toolbar.selectors';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  positionX = 100;
  positionY = 100;
  
  readonly isLockedLayout = this.store.select(toolbarSelectors.selectIsLockedLayout);

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
