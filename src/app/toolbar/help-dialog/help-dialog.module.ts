import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {CoinModule} from '../../coin/coin.module';
import {HelpDialog} from './help-dialog';


@NgModule({
  imports: [
    CoinModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  declarations: [HelpDialog],
})
export class HelpDialogModule {}
