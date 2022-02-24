import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';


export enum Theme {
  Dark = 'dark-mode',
  Light = 'light-mode',
}


@Injectable({providedIn: 'root'})
export class ThemeService {
  private renderer: Renderer2;
  private colorTheme = localStorage.getItem('user-theme') ?? Theme.Light;

  private readonly isDarkThemeSubject = 
      new BehaviorSubject<boolean>(this.colorTheme === Theme.Dark);

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  initTheme() {
    this.renderer.addClass(document.body, this.colorTheme);
  }

  isDarkMode(): Observable<boolean> {
    return this.isDarkThemeSubject.asObservable();
  }

  update(theme: Theme) {
    const isDarkMode = theme === Theme.Dark;
    this.isDarkThemeSubject.next(isDarkMode);

    this.setColorTheme(theme);
    const previousColorTheme = isDarkMode ? Theme.Light : Theme.Dark;
    this.renderer.removeClass(document.body, previousColorTheme);
    this.renderer.addClass(document.body, theme);
  }

  private setColorTheme(theme: Theme) {
    this.colorTheme = theme;
    localStorage.setItem('user-theme', theme);
  }
}
