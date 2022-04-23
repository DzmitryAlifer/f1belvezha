import {AfterViewInit, Component, Input} from '@angular/core';
import {getShortName} from '../common';
import {EventType} from '../enums';
import {DriverRoundResult, Prediction} from '../types';


@Component({
  selector: 'result-details',
  templateUrl: './result-details.html',
  styleUrls: ['./result-details.scss'],
})
export class ResultDetailsComponent implements AfterViewInit {
  @Input() playerPrediction: Prediction|undefined;
  @Input() result: DriverRoundResult|undefined;

  readonly EventType = EventType;

  driverResultCodeNames: {qualifying: string[]; race: string[]} | undefined;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.driverResultCodeNames = {
        qualifying: this.getShortNames(this.result?.qualifying) ?? [],
        race: this.getShortNames(this.result?.race) ?? [],
      };
    });
  }

  getShortNames(fullNames: string[] = []): string[] {
    return (fullNames ?? []).map(fullName => getShortName(fullName));
  }

  isCorrectOnList(eventType: EventType, index: number): boolean {
    switch (eventType) {
      case EventType.Qualification:
        return !!this.result?.qualifying && !!this.playerPrediction?.qualification.length &&
            this.playerPrediction?.qualification.includes(this.result?.qualifying[index]);
      case EventType.Race:
        return !!this.result?.race && !!this.playerPrediction?.race.length &&
          this.playerPrediction?.race.includes(this.result?.race[index]);
      default:
        return false;
    }
  }

  isCorrectPosition(eventType: EventType, index: number): boolean {
    switch (eventType) {
      case EventType.Qualification:
        return !!this.result?.qualifying && !!this.playerPrediction?.qualification.length && 
            this.playerPrediction?.qualification[index] === this.result?.qualifying[index];
      case EventType.Race:
        return !!this.result?.race && !!this.playerPrediction?.race.length && 
            this.playerPrediction?.race[index] === this.result?.race[index];
      default:
        return false;
    }
  }
}
