import {DragDropModule} from '@angular/cdk/drag-drop'; 
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DriversStandingModule} from '../drivers-standing/drivers-standing.module';
import {FullResultsModule} from '../full-results/full-results.module';
import {UsersStandingModule} from '../users-standing/users-standing.module';
import {PredictionGameComponent} from './prediction-game';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    DragDropModule,
    DriversStandingModule,
    FullResultsModule,
    UsersStandingModule,
  ],
  declarations: [PredictionGameComponent],
  exports: [PredictionGameComponent],
})
export class PredictionGameModule {}
