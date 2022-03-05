import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon'
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSidenavModule} from '@angular/material/sidenav';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {ToolbarEffects} from './store/toolbar.effects';
import {toolbarReducer} from './store/toolbar.reducer';
import {ToolbarComponent} from './toolbar.component';


@NgModule({
  imports: [
    CommonModule, 
    MatButtonModule,
    MatDialogModule, 
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSlideToggleModule,
    StoreModule.forFeature('toolbar', toolbarReducer),
    EffectsModule.forFeature([ToolbarEffects]),
  ],
  declarations: [ToolbarComponent],
  exports: [ToolbarComponent],
})
export class ToolbarModule { }
