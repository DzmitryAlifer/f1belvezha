import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullResultsComponent } from './full-results.component';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import { CircuitMapModule } from '../circuit-map/circuit-map.module';

@NgModule({
  imports: [
    CircuitMapModule,
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
  ],
  declarations: [FullResultsComponent],
  exports: [FullResultsComponent],
})
export class FullResultsModule { }
