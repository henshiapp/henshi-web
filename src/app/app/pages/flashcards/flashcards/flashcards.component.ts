import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, model, OnInit, signal } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
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
import { debounceTime } from 'rxjs';
import { PaginatorModule, PaginatorState } from "primeng/paginator";
import { MenuModule } from "primeng/menu";
import { QuillViewComponent } from 'ngx-quill';
import { InputIcon } from "primeng/inputicon";
import { InputText } from "primeng/inputtext";
import { IconField } from 'primeng/iconfield';
import { TooltipModule } from 'primeng/tooltip';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import dayjs from 'dayjs';

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
    PaginatorModule,
    MenuModule,
    QuillViewComponent,
    InputIcon,
    InputText,
    IconField,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule
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
  protected flashcardsService = inject(FlashcardsService);

  collectionId = this.route.snapshot.paramMap.get('collectionId') ?? '';
  selectedFlashcardId = signal<string | null>(null);
  showCreateDialog = signal(false);
  isCreateDialogOpen = signal(false);

  page = signal(1);
  pageSize = signal(10);
  first = signal((this.page() - 1) * this.pageSize());

  searchControl = new FormControl();
  search = signal('');

  flashcards = this.flashcardsService.flashcards;
  metadata = this.flashcardsService.metadata;
  loading = this.flashcardsService.loading;
  error = this.flashcardsService.error;

  options: MenuItem[] = [];

  dayjs = dayjs;
  
  ngOnInit() {
    this.title.setTitle('Flashcards');
    this.breadcrumb.set([{ label: 'Collections', path: ROUTES.cardCollections }, { label: 'Flashcards', path: window.location.pathname }]);
    
    this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe(search => {
      this.search.set(search);
      this.flashcardsService.load(this.collectionId, this.search(), this.page(), this.pageSize());
    })

    this.options = [
      {
        label: 'Options',
        items: [
          {
            label: 'Remove',
            icon: 'ph ph-trash',
            command: () => {
              if (this.selectedFlashcardId()) {
                this.confirmDelete(this.selectedFlashcardId()!)
              }
            }
          },
        ]
      }
    ];

    if (this.collectionId) {
      this.flashcardsService.load(this.collectionId, undefined, this.page(), this.pageSize());
    }
  }

  async reload({ page, pageSize } = { page: this.page(), pageSize: this.pageSize() }) {
    this.flashcardsService.load(this.collectionId, this.search(), page, pageSize);
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
