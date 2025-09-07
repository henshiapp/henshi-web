import { ChangeDetectionStrategy, Component, input, model, output, signal, OnInit } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { PaginationMetadata } from '../../../core/types/Api';
import { JsonPipe } from '@angular/common';

export type OnPageChangeResponse = {
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-pagination',
  imports: [PaginatorModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  page = input(1);
  pageSize = input(10);
  pageSizeOptions = input([10, 20, 30]);
  metadata = input<PaginationMetadata | undefined>();
  onPageChange = output<OnPageChangeResponse>();

  first = signal(0);
  rows = signal(10);

  ngOnInit() {
    this.first.set((this.page() - 1) * this.pageSize());
    this.rows.set(this.pageSize());
  }

  _onPageChange(event: PaginatorState) {
    if (event.first != null) {
      this.first.set(event.first);
    }
    if (event.rows != null) {
      this.rows.set(event.rows);
    }

    if (event.page != null && event.rows != null) {
      this.onPageChange.emit({ page: event.page + 1, pageSize: event.rows });
    }
  }
}
