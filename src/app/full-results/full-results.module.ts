import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullResultsComponent } from './full-results.component';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule,
  ],
  declarations: [FullResultsComponent],
  exports: [FullResultsComponent],
})
export class FullResultsModule { }
