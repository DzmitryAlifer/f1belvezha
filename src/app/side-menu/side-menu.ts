import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import {Page} from '../enums';
import {ToolbarActionType} from '../toolbar/store/toolbar.actions';
import * as toolbarSelectors from '../toolbar/store/toolbar.selectors';


@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.html',
  styleUrls: ['./side-menu.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent {
  isOpen = false;
  readonly Page = Page;

  readonly isDarkMode = this.store.select(toolbarSelectors.selectIsDarkMode);
  readonly isCurrentUserAdmin = this.store.select(toolbarSelectors.selectCurrentUser).pipe(map(user => user?.admin));
  readonly page = this.store.select(toolbarSelectors.selectPage);

  constructor(private readonly store: Store) {}

  showPage(page: Page): void {
    setTimeout(() => {
      this.isOpen = false;
      this.store.dispatch({type: ToolbarActionType.SHOW_PAGE, payload: {page}});
    }, 100);
  }
}
