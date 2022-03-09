import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';


@Component({
  selector: 'next-event',
  templateUrl: './next-event.component.html',
  styleUrls: ['./next-event.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextEventComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
  }

}
