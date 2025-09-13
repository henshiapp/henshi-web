import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom, tap } from 'rxjs';
import { CardCollection } from '../../core/types/CardCollection';
import { ApiResponse, PaginationMetadata } from '../../core/types/Api';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class CardCollectionsService {
  collections = signal<CardCollection[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  metadata = signal<PaginationMetadata | null>(null);

  constructor(private readonly http: HttpClient, private readonly auth: AuthenticationService) { }

  fetch(search?: string, page?: number, pageSize?: number) {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<ApiResponse<CardCollection[]>>(`/v1/card-collections`, {
        params: {
          ...(page ? { page: page.toString() } : {}),
          ...(pageSize ? { pageSize: pageSize.toString() } : {}),
          ...(search ? { search } : {}),
        }
      })
      .pipe(
        tap({
          next: (res) => {
            this.collections.set(res.data!);
            this.metadata.set(res.metadata);
            this.loading.set(false);
          },
          error: (err) => {
            this.error.set(err.message || 'Error fetching collections');
            this.loading.set(false);
          }
        })
      )
      .subscribe();
  }

  create(payload: Partial<CardCollection>) {
    return this.http.post<CardCollection>('/v1/card-collections', payload);
  }

  delete(id: string) {
    return this.http.delete(`/v1/card-collections/${id}`);
  }
}
