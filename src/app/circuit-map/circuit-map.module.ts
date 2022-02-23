import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircuitMapComponent } from './circuit-map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';


@NgModule({
  imports: [
    CommonModule,
    LeafletModule,
  ],
  declarations: [CircuitMapComponent],
  exports: [CircuitMapComponent],
})
export class CircuitMapModule { }
