import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoinComponent} from './coin';


@NgModule({
  imports: [CommonModule],
  declarations: [CoinComponent],
  exports: [CoinComponent],
})
export class CoinModule { }
