import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  private _title$ = new BehaviorSubject<string>('Henshi');
  title$ = this._title$.asObservable();

  title = inject(Title);

  setTitle(title: string) {
    const tabTitle = `${title} | Henshi`

    this._title$.next(title);
    this.title.setTitle(tabTitle);
  }
}
