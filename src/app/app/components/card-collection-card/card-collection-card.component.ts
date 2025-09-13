import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ToastService } from '../../../core/services/toast.service';
import { CardCollectionsService } from '../../services/card-collections.service';
import { CardCollection } from '../../../core/types/CardCollection';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService, MenuItem } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-card-collection-card',
  imports: [CommonModule, RouterModule, ButtonModule, MenuModule, ConfirmDialogModule],
  templateUrl: './card-collection-card.component.html',
  styleUrl: './card-collection-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardCollectionCardComponent {
  @Input() collection!: CardCollection;
  @Output() deleted = new EventEmitter<void>();

  private service = inject(CardCollectionsService);
  private toast = inject(ToastService);
  private confirmation = inject(ConfirmationService);

  options: MenuItem[] = [];

  ngOnInit() {
    this.options = [
      {
        label: 'Options',
        items: [
          {
            label: 'Remove',
            icon: 'ph ph-trash',
            command: () => this.confirmDelete()
          },
        ]
      }
    ];
  }

  confirmDelete() {
    this.confirmation.confirm(
      {
        header: 'Do you really want to delete this collection?',
        message: 'This action is irreversible and will delete all flashcards associated with it',
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
          this.service.delete(this.collection.id).subscribe({
            next: () => {
              this.toast.success('Collection deleted successfully');
              this.deleted.emit();
            },
            error: (err: HttpErrorResponse) => {
              this.toast.error('Error while trying to delete collection', err.message);
            }
          })
        },
        reject: () => { },
      }
    );
  }
}
