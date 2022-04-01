import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Page} from './enums';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly startPage = localStorage.getItem('startPage') as Page;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.router.navigateByUrl('/' + this.startPage);
  }
}
