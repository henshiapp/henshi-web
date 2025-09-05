import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';
import { PageTitleService } from '../../../../core/services/page-title.service';
import { CardCollectionsService } from '../../../services/card-collections.service';
import { CardCollectionCardComponent } from '../../../components/card-collection-card/card-collection-card.component';
import { CreateCardCollectionFormComponent } from '../../../components/create-card-collection-form/create-card-collection-form.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-card-collections',
  imports: [
    CommonModule,
    ButtonModule,
    MessageModule,
    ConfirmDialogModule,
    CreateCardCollectionFormComponent,
    CardCollectionCardComponent,
    LoadingSpinnerComponent,
    PaginationComponent
  ],
  templateUrl: './card-collections.component.html',
  styleUrl: './card-collections.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardCollectionsComponent {
  private service = inject(CardCollectionsService);
  private title = inject(PageTitleService);
  private breadcrumb = inject(BreadcrumbService);

  collections = this.service.collections;
  metadata = this.service.metadata;
  loading = this.service.loading;
  error = this.service.error;

  dialogOpen = signal(false);

  constructor() {
    this.title.setTitle('Card collections');
    this.breadcrumb.set([{ label: 'Collections', path: '/app/card-collections' }]);
    this.service.fetch(1, 10, '');
  }

  openDialog() {
    this.dialogOpen.set(true);
  }

  closeDialog(refresh: boolean) {
    this.dialogOpen.set(false);
    if (refresh) this.reload();
  }

  reload() {
    this.service.fetch(1, 10, '');
  }
}
