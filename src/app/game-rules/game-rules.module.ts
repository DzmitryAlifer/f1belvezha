import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {GameRulesComponent} from './game-rules';
import {CoinModule} from '../coin/coin.module';


@NgModule({
  imports: [
    CoinModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  declarations: [GameRulesComponent],
  exports: [GameRulesComponent],
})
export class GameRulesModule { }
