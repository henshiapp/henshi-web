import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { PaginationMetadata } from "../../core/types/Api";
import { Flashcard } from "../../core/types/Flashcard";
import { Injectable, signal } from "@angular/core";
import { catchError, of, tap } from "rxjs";
import { AuthenticationService } from "../../auth/services/auth.service";

@Injectable({ providedIn: 'root' })
export class FlashcardsService {
    private apiUrl = environment.api.url;
    
    flashcards = signal<Flashcard[]>([]);
    metadata = signal<PaginationMetadata | null>(null);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);
    
    flashcardsToRecall = signal<Flashcard[]>([]);
    recallError = signal<string | null>(null);

    constructor(private http: HttpClient, private auth: AuthenticationService) { }
    
    load(collectionId: string, page = 1, pageSize = 5, search = '') {
        this.loading.set(true);
        this.http
        .get<{ data: Flashcard[]; metadata: PaginationMetadata }>(
            `${this.apiUrl}/v1/card-collections/${collectionId}/flashcards`,
            {
                params: { page, pageSize, search }, headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.auth.accessToken}`,
                },
            }
        )
        .pipe(
            tap(res => {
                this.flashcards.set(res.data);
                this.metadata.set(res.metadata);
                this.error.set(null);
            }),
            catchError(err => {
                this.error.set(err.message);
                return of(null);
            })
        )
        .subscribe(() => this.loading.set(false));
    }
    
    create(collectionId: string, payload: Partial<Flashcard>) {
        return this.http.post(`${this.apiUrl}/v1/card-collections/${collectionId}/flashcards`, payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.auth.accessToken}`,
            },
        });
    }
    
    delete(collectionId: string, id: string) {
        return this.http.delete(`${this.apiUrl}/v1/card-collections/${collectionId}/flashcards/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.auth.accessToken}`,
            },
        });
    }

    getRecall(collectionId: string) {
        this.loading.set(true);
        this.http
        .get<{ data: Flashcard[]; metadata: PaginationMetadata }>(
            `${this.apiUrl}/v1/card-collections/${collectionId}/flashcards/recall`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.auth.accessToken}`,
                },
            }
        )
        .pipe(
            tap(res => {
                this.flashcardsToRecall.set(res.data);
                this.recallError.set(null);
                this.loading.set(false);
            }),
            catchError(err => {
                this.recallError.set(err.message);
                this.loading.set(false);
                return of(null);
            })
        )
        .subscribe(() => this.loading.set(false));
    }

    finishRecall(collectionId: string, answers: { flashcardId: string; correct: boolean; }[]) {
        return this.http.post(`${this.apiUrl}/v1/card-collections/${collectionId}/flashcards/recall`, {
            answers
        } ,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.auth.accessToken}`,
            },
        });
    }
}
