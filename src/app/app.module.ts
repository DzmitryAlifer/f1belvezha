import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FullResultsModule} from './full-results/full-results.module';
import {ToolbarModule} from './toolbar/toolbar.module';
import {CreateAccountDialogModule} from './toolbar/create-account-dialog/create-account-dialog.module';
import {LoginDialogModule} from './toolbar/login-dialog/login-dialog.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSidenavModule} from '@angular/material/sidenav';
import {UsersStandingModule} from './users-standing/users-standing.module';


@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CreateAccountDialogModule,
    FullResultsModule,
    HttpClientModule,
    LoginDialogModule,
    ToolbarModule,
    UsersStandingModule,
    MatSlideToggleModule,
    MatSidenavModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
