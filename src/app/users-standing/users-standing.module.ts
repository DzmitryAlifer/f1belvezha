import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {UsersStandingComponent} from './users-standing';


@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
  ],
  declarations: [UsersStandingComponent],
  exports: [UsersStandingComponent],
})
export class UsersStandingModule {}
