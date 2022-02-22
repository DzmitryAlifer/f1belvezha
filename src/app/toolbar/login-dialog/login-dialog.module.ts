import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {LoginDialog} from './login-dialog';


@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule,
  ],
  declarations: [LoginDialog],
})
export class LoginDialogModule {}
