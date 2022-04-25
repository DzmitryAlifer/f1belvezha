import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {SeasonStandingComponent} from './season-standing';


@NgModule({
  imports: [
    CommonModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
  ],
  declarations: [SeasonStandingComponent],
  exports: [SeasonStandingComponent],
})
export class SeasonStandingModule { }
