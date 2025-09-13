import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';
import { PageTitleService } from '../../../../core/services/page-title.service';
import { CardCollectionsService } from '../../../services/card-collections.service';
import { CardCollectionCardComponent } from '../../../components/card-collection-card/card-collection-card.component';
import { CreateCardCollectionFormComponent } from '../../../components/create-card-collection-form/create-card-collection-form.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { SearchService } from '../../../../core/services/search.service';
import { debounceTime, firstValueFrom } from 'rxjs';
import { PaginatorModule, PaginatorState } from "primeng/paginator";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';

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
    PaginatorModule,
    InputIcon,
    InputText,
    IconField,
    ReactiveFormsModule
],
  templateUrl: './card-collections.component.html',
  styleUrl: './card-collections.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardCollectionsComponent implements OnInit {
  private service = inject(CardCollectionsService);
  private titleService = inject(PageTitleService);
  private breadcrumbService = inject(BreadcrumbService);
  private searchService = inject(SearchService);

  collections = this.service.collections;
  metadata = this.service.metadata;
  loading = this.service.loading;
  error = this.service.error;

  page = signal(1);
  pageSize = signal(10);
  first = signal((this.page() - 1) * this.pageSize())
  dialogOpen = signal(false);

  searchControl = new FormControl();
  search = signal('');

  ngOnInit() {
    this.titleService.setTitle('Card collections');
    this.breadcrumbService.set([{ label: 'Collections', path: '/app/card-collections' }]);

    this.searchControl.valueChanges.pipe(debounceTime(500)).subscribe(search => {
      this.search.set(search);
      this.service.fetch(this.search(), this.page(), this.pageSize());
    })

    this.service.fetch();
  }

  openDialog() {
    this.dialogOpen.set(true);
  }

  closeDialog(refresh: boolean) {
    this.dialogOpen.set(false);
    if (refresh) this.reload();
  }

  async reload({ page, pageSize } = { page: this.page(), pageSize: this.pageSize() }) {
    const search = await firstValueFrom(this.searchService.search$);
    this.service.fetch(search, page, pageSize);
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
