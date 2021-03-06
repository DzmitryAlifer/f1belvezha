import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {FullResultsComponent} from './full-results.component';
import {FullResultsEffects} from './store/full-results.effects';
import {fullResultsReducer} from './store/full-results.reducer';
import {PointsModule} from '../points/points.module';
import {ResultDetailsModule} from '../result-details/result-details.module';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatTableModule,
    PointsModule,
    ResultDetailsModule,
    StoreModule.forFeature('fullResults', fullResultsReducer),
    EffectsModule.forFeature([FullResultsEffects]),
  ],
  declarations: [FullResultsComponent],
  exports: [FullResultsComponent],
})
export class FullResultsModule {}
