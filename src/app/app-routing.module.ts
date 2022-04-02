import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CalendarComponent} from './calendar/calendar.component';
import {ChartsComponent} from './charts/charts';
import {NewsComponent} from './news/news';
import {GameRulesComponent} from './game-rules/game-rules';
import {PredictionGameComponent} from './prediction-game/prediction-game';


const routes: Routes = [
  {path: 'news', component: NewsComponent},
  {path: 'calendar', component: CalendarComponent},
  {path: 'rules', component: GameRulesComponent},
  {path: 'game', component: PredictionGameComponent},
  {path: 'charts', component: ChartsComponent},
  {path: '**', redirectTo: 'news', pathMatch: 'full'},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
