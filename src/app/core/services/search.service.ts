import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SearchService {
    private _search$ = new BehaviorSubject<string>('');
    search$ = this._search$.asObservable();

    setSearch(search: string) {
        this._search$.next(search);
    }
}
