import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {UsersStandingComponent} from './users-standing';


@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
  ],
  declarations: [UsersStandingComponent],
  exports: [UsersStandingComponent],
})
export class UsersStandingModule {}
