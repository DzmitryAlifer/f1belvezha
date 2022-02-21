import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon'
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar'
import {ToolbarComponent} from './toolbar.component';

@NgModule({
  imports: [
    CommonModule, 
    MatButtonModule,
    MatDialogModule, 
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
  ],
  declarations: [ToolbarComponent],
  exports: [ToolbarComponent],
})
export class ToolbarModule { }
