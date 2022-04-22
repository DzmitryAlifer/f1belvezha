import {DragDropModule} from '@angular/cdk/drag-drop'; 
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EffectsModule} from '@ngrx/effects'; 
import {StoreModule} from '@ngrx/store';
import {AccountModule} from './account/account.module';
import {AdminModule} from './admin/admin.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CalendarModule} from './calendar/calendar.module';
import {ChartsModule} from './charts/charts.module';
import {CoinModule} from './coin/coin.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {DriverPlacesModule} from './driver-places/driver-places.module';
import {DriversStandingModule} from './drivers-standing/drivers-standing.module';
import {FullResultsModule} from './full-results/full-results.module';
import {GameRulesModule} from './game-rules/game-rules.module';
import {NewsModule} from './news/news.module';
import {ResultDetailsModule} from './result-details/result-details.module';
import {ToolbarModule} from './toolbar/toolbar.module';
import {CreateAccountDialogModule} from './toolbar/create-account-dialog/create-account-dialog.module';
import {LoginDialogModule} from './toolbar/login-dialog/login-dialog.module';
import {NextEventModule} from './toolbar/next-event/next-event.module';
import {UsersStandingModule} from './users-standing/users-standing.module';
import {PointsModule} from './points/points.module';
import {PredictionDialogModule} from './prediction-dialog/prediction-dialog.module';
import {EncryptionService} from './service/encryption.service';
import {SideMenuModule} from './side-menu/side-menu.module';
import {PredictionGameModule} from './prediction-game/prediction-game.module';


@NgModule({
  imports: [
    AccountModule,
    AdminModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CalendarModule,
    ChartsModule,
    CoinModule,
    CreateAccountDialogModule,
    DashboardModule,
    DragDropModule,
    DriverPlacesModule,
    DriversStandingModule,
    FullResultsModule,
    GameRulesModule,
    HttpClientModule,
    LoginDialogModule,
    MatSidenavModule,
    MatSlideToggleModule,
    NewsModule,
    NextEventModule,
    PointsModule,
    PredictionDialogModule,
    PredictionGameModule,
    ResultDetailsModule,
    SideMenuModule,
    ToolbarModule,
    UsersStandingModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
  ],
  providers: [EncryptionService],
  bootstrap: [AppComponent],
  declarations: [AppComponent],
})
export class AppModule { }
