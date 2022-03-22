import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {UsersStandingComponent} from './users-standing';


@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
  ],
  declarations: [UsersStandingComponent],
  exports: [UsersStandingComponent],
})
export class UsersStandingModule {}
