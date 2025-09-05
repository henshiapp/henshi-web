import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { CreateFlashcardFormComponent } from '../../../components/create-flashcard-form/create-flashcard-form.component';
import { FlashcardsService } from '../../../services/flashcards.service';

@Component({
  selector: 'app-flashcards',
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    ConfirmDialogModule,
    TagModule,
    ScrollPanelModule,
    PaginationComponent,
    LoadingSpinnerComponent,
    CreateFlashcardFormComponent,
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
  protected flashcardsService = inject(FlashcardsService);

  collectionId = this.route.snapshot.paramMap.get('collectionId') ?? '';
  showCreateDialog = signal(false);
  isCreateDialogOpen = signal(false);

  flashcards = this.flashcardsService.flashcards;
  metadata = this.flashcardsService.metadata;
  loading = this.flashcardsService.loading;
  error = this.flashcardsService.error;

  ngOnInit() {
    if (this.collectionId) {
      this.flashcardsService.load(this.collectionId);
    }
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
            this.flashcardsService.load(this.collectionId);
          },
          error: () => {
            this.toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete flashcard' });
          },
        });
      },
    });
  }
}
