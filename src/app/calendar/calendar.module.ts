import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {CalendarComponent} from './calendar.component';


@NgModule({
  imports: [CommonModule, MatTableModule],
  declarations: [CalendarComponent],
  exports: [CalendarComponent],
})
export class CalendarModule {}
