import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { catchError, of, tap } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DashboardService {
    flashcardCollectionCount = signal<number>(0);
    flashcardCount = signal<number>(0);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);

    constructor(private readonly http: HttpClient) { }

    getStats() {
        this.loading.set(true);
        this.http
            .get<{ flashcardCollectionCount: number, flashcardCount: number }>(`/v1/card-collections/stats`)
            .pipe(
                tap(res => {
                    this.flashcardCollectionCount.set(res.flashcardCollectionCount);
                    this.flashcardCount.set(res.flashcardCount);
                    this.error.set(null);
                }),
                catchError(err => {
                    this.error.set(err.message);
                    return of(null);
                })
            )
            .subscribe(() => this.loading.set(false));
    }
}
