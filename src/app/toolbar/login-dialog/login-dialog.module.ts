import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {LoginDialog} from './login-dialog';
import {ToolbarEffects} from '../store/toolbar.effects';
import {toolbarReducer} from '../store/toolbar.reducer';


@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule,
    StoreModule.forFeature('toolbar', toolbarReducer),
    EffectsModule.forFeature([ToolbarEffects]),
  ],
  declarations: [LoginDialog],
})
export class LoginDialogModule {}
