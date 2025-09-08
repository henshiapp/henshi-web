import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, model, OnInit, signal } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { CreateFlashcardFormComponent } from '../../../components/create-flashcard-form/create-flashcard-form.component';
import { FlashcardsService } from '../../../services/flashcards.service';
import { PageTitleService } from '../../../../core/services/page-title.service';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';
import { ROUTES } from '../../../routes';
import { SearchService } from '../../../../core/services/search.service';
import { firstValueFrom } from 'rxjs';
import { PaginatorModule, PaginatorState } from "primeng/paginator";

@Component({
  selector: 'app-flashcards',
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    ConfirmDialogModule,
    TagModule,
    ScrollPanelModule,
    LoadingSpinnerComponent,
    CreateFlashcardFormComponent,
    PaginatorModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './flashcards.component.html',
  styleUrl: './flashcards.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlashcardsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private confirmation = inject(ConfirmationService);
  private toast = inject(MessageService);
  private title = inject(PageTitleService);
  private breadcrumb = inject(BreadcrumbService);
  private searchService = inject(SearchService);
  protected flashcardsService = inject(FlashcardsService);

  collectionId = this.route.snapshot.paramMap.get('collectionId') ?? '';
  showCreateDialog = signal(false);
  isCreateDialogOpen = signal(false);
  page = signal(1);
  pageSize = signal(10);
  first = signal((this.page() - 1) * this.pageSize());

  flashcards = this.flashcardsService.flashcards;
  metadata = this.flashcardsService.metadata;
  loading = this.flashcardsService.loading;
  error = this.flashcardsService.error;

  ngOnInit() {
    this.title.setTitle('Flashcards');
    this.breadcrumb.set([{ label: 'Collections', path: ROUTES.cardCollections }, { label: 'Flashcards', path: window.location.pathname }]);

    if (this.collectionId) {
      this.flashcardsService.load(this.collectionId, undefined, this.page(), this.pageSize());
    }

    this.searchService.search$.subscribe(async (search) => {
      this.flashcardsService.load(this.collectionId, search, this.page(), this.pageSize());
    })
  }

  async reload({ page, pageSize } = { page: this.page(), pageSize: this.pageSize() }) {
    const search = await firstValueFrom(this.searchService.search$);
    this.flashcardsService.load(this.collectionId, search, page, pageSize);
  }

  confirmDelete(id: string) {
    this.confirmation.confirm({
      header: 'Do you really want to delete this flashcard?',
      message: 'This action is irreversible',
      icon: 'ph ph-warning',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.flashcardsService.delete(this.collectionId, id).subscribe({
          next: () => {
            this.toast.add({ severity: 'success', summary: 'Deleted', detail: 'Flashcard deleted successfully' });
            this.reload();
          },
          error: () => {
            this.toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete flashcard' });
          },
        });
      },
    });
  }

  onPageChange(event: PaginatorState) {
    if (event.first != null) {
      this.first.set(event.first);
    }
    if (event.page != null && event.rows != null) {
      return this.reload({ page: event.page + 1, pageSize: event.rows })
    }
    return this.reload();
  }
}
