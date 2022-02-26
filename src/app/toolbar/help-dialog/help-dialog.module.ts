import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {HelpDialog} from './help-dialog';


@NgModule({
  imports: [CommonModule, MatButtonModule],
  declarations: [HelpDialog],
})
export class HelpDialogModule {}
