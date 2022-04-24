import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SeasonStandingComponent} from './season-standing';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [SeasonStandingComponent],
  exports: [SeasonStandingComponent],
})
export class SeasonStandingModule { }
