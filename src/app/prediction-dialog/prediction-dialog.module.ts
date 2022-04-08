import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DriverBolidComponent} from './driver-bolid';
import {PredictionDialog} from './prediction-dialog';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule, 
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatTooltipModule, 
    ReactiveFormsModule,
  ],
  declarations: [DriverBolidComponent, PredictionDialog],
})
export class PredictionDialogModule { }
