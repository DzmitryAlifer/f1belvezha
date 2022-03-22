import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NewsComponent} from './news';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [NewsComponent],
  exports: [NewsComponent],
})
export class NewsModule {}
