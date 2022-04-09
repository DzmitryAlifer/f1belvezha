import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {AccountComponent} from './account';


@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
  ],
  declarations: [AccountComponent],
  exports: [AccountComponent],
})
export class AccountModule {}
