import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccountComponent} from './account/account';
import {AdminComponent} from './admin/admin';
import {CalendarComponent} from './calendar/calendar.component';
import {ChartsComponent} from './charts/charts';
import {DashboardComponent} from './dashboard/dashboard';
import {NewsComponent} from './news/news';
import {GameRulesComponent} from './game-rules/game-rules';
import {PredictionGameComponent} from './prediction-game/prediction-game';


const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'news', component: NewsComponent},
  {path: 'calendar', component: CalendarComponent},
  {path: 'rules', component: GameRulesComponent},
  {path: 'game', component: PredictionGameComponent},
  {path: 'charts', component: ChartsComponent},
  {path: 'account', component: AccountComponent},
  {path: 'admin', component: AdminComponent},
  {path: '**', redirectTo: 'dashboard', pathMatch: 'full'},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
