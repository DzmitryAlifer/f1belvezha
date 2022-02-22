import {Injectable} from '@angular/core';


@Injectable({providedIn: 'root'})
export class LocalStorageService {

  getItem<T>(key: string) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) as T : null;
  }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}