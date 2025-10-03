import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ApiResponse, PaginationMetadata } from "../../core/types/Api";
import { Flashcard, Grade } from "../../core/types/Flashcard";
import { Injectable, signal } from "@angular/core";
import { catchError, of, tap } from "rxjs";
import { AuthenticationService } from "../../auth/services/auth.service";

@Injectable({ providedIn: 'root' })
export class FlashcardsService {
    flashcards = signal<Flashcard[]>([]);
    metadata = signal<PaginationMetadata | null>(null);
    loading = signal<boolean>(false);
    error = signal<string | null>(null);

    flashcardsToRecall = signal<Flashcard[]>([]);
    recallError = signal<string | null>(null);

    constructor(private http: HttpClient, private auth: AuthenticationService) { }

    load(collectionId: string, search?: string, page?: number, pageSize?: number) {
        this.loading.set(true);
        this.http
            .get<{ data: Flashcard[]; metadata: PaginationMetadata }>(
                `/v1/card-collections/${collectionId}/flashcards`,
                {
                    params: {
                        ...(page ? { page: page?.toString() } : {}),
                        ...(pageSize ? { pageSize: pageSize?.toString() } : {}),
                        ...(search ? { search } : {}),
                    }
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
        return this.http.post(`/v1/card-collections/${collectionId}/flashcards`, payload);
    }

    update(collectionId: string, id: string, payload: Partial<Flashcard>) {
        return this.http.patch(`/v1/card-collections/${collectionId}/flashcards/${id}`, payload);
    }

    delete(collectionId: string, id: string) {
        return this.http.delete(`/v1/card-collections/${collectionId}/flashcards/${id}`);
    }

    getById(collectionId: string, id: string) {
        return this.http.get<ApiResponse<Flashcard>>(`/v1/card-collections/${collectionId}/flashcards/${id}`);
    }

    getRecall(collectionId: string) {
        this.loading.set(true);
        this.http
            .get<{ data: Flashcard[]; metadata: PaginationMetadata }>(
                `/v1/card-collections/${collectionId}/flashcards/recall`
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

    finishRecall(collectionId: string, answers: { flashcardId: string; grade: Grade; }[]) {
        return this.http.post(`/v1/card-collections/${collectionId}/flashcards/recall`, {
            answers
        });
    }
}
