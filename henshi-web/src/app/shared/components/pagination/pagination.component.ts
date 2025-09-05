import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { PaginationMetadata } from '../../../core/types/Api';

@Component({
  selector: 'app-pagination',
  imports: [PaginatorModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  first: number = 0;
  @Input() pageSize: number = 10;
  @Input() metadata?: PaginationMetadata;

  onPageChange(event: PaginatorState) {
      this.first = event.first ?? 0;
      this.pageSize = event.rows ?? 10;
  }
}
