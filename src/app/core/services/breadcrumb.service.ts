import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Crumb { label: string; path: string; }

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private _crumbs$ = new BehaviorSubject<Crumb[]>([]);
  crumbs$ = this._crumbs$.asObservable();

  set(crumbs: Crumb[]) {
    this._crumbs$.next(crumbs);
  }
}
