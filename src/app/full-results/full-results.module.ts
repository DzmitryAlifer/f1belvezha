import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FullResultsComponent} from './full-results.component';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
  ],
  declarations: [FullResultsComponent],
  exports: [FullResultsComponent],
})
export class FullResultsModule { }
