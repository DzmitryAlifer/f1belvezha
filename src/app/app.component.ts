import {CdkDragEnd} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LocalStorageService} from './service/local-storage.service';
import {DropPoint} from './types';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  positionX = 100;
  positionY = 100;
  readonly savedPosition = this.localStorageService.getItem<DropPoint>('dropPointUserStanding') ?? {x: 0, y: 0};

  constructor(private readonly localStorageService: LocalStorageService) {}

  savePosition(event: CdkDragEnd): void {
    const dragPosition: DropPoint = event.source.getFreeDragPosition();
    this.localStorageService.setItem('dropPointUserStanding', dragPosition);
  }
}
