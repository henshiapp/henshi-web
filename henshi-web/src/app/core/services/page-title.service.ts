import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  private _title$ = new BehaviorSubject<string>('Dashboard');
  title$ = this._title$.asObservable();

  setTitle(title: string) {
    this._title$.next(title);
  }
}
