import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CalendarComponent} from './calendar/calendar.component';
import {ChartsComponent} from './charts/charts';
import {NewsComponent} from './news/news';
import {PredictionGameComponent} from './prediction-game/prediction-game';


const routes: Routes = [
  {path: 'news', component: NewsComponent},
  {path: 'calendar', component: CalendarComponent},
  {path: 'game', component: PredictionGameComponent},
  {path: 'charts', component: ChartsComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
