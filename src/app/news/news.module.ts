import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {NewsComponent} from './news';


@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
  ],
  declarations: [NewsComponent],
  exports: [NewsComponent],
})
export class NewsModule {}
