import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NextEventComponent} from './next-event.component';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [NextEventComponent],
  exports: [NextEventComponent],
})
export class NextEventModule {}
