import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {DriverBolidModule} from '../driver-bolid/driver-bolid.module';
import {DriverPlacesComponent} from './driver-places';


@NgModule({
  imports: [
    CommonModule,
    DriverBolidModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  declarations: [DriverPlacesComponent],
  exports: [DriverPlacesComponent],
})
export class DriverPlacesModule {}
