import {ChangeDetectionStrategy, Component} from '@angular/core';


@Component({
  selector: 'admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {

  constructor() {}
}
