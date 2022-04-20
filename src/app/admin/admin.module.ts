import {NgModule} from '@angular/core';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {CommonModule} from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {AdminComponent} from './admin';


@NgModule({
  imports: [CdkAccordionModule, CommonModule, MatExpansionModule, MatIconModule],
  declarations: [AdminComponent],
  exports: [AdminComponent],
})
export class AdminModule {}
