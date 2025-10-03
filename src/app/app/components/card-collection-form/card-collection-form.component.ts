import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, EventEmitter, inject, input, Input, model, Output, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { PopoverModule } from 'primeng/popover';
import { icons } from "@phosphor-icons/core";
import { CardCollectionsService } from '../../services/card-collections.service';
import { ToastService } from '../../../core/services/toast.service';
import { CardCollection } from '../../../core/types/CardCollection';
import { Drawer } from "primeng/drawer";

@Component({
  selector: 'app-card-collection-form',
  imports: [
    CommonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    ReactiveFormsModule,
    PopoverModule,
    FormsModule,
    Drawer
  ],
  templateUrl: './card-collection-form.component.html',
  styleUrl: './card-collection-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardCollectionFormComponent {
  type = input.required<'CREATE' | 'UPDATE'>();
  collectionId = input<string | null>(null);
  visible = model<boolean>(false);
  @Output() closed = new EventEmitter<boolean>();
  @Output() submitted = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private service = inject(CardCollectionsService);
  private toast = inject(ToastService);
  protected breakpointObserver = inject(BreakpointObserver)

  iconSearch = model<string>('');

  form = this.fb.group({
    icon: ['ph-cards', Validators.required],
    title: ['', [Validators.required, Validators.maxLength(30)]],
    description: ['', [Validators.maxLength(255)]]
  });
  icons = icons

  loading = signal(false);

  Breakpoints = Breakpoints;

  constructor() {
    effect(() => {
      const collectionId = this.collectionId();

      if (this.type() === 'UPDATE' && collectionId) {
        this.service.getById(collectionId).subscribe({
          next: ({ data: collection }) => {
            this.form.setValue({
              icon: collection.icon,
              title: collection.title,
              description: collection.description,
            })
          }
        });
      }
    })
  }

  handleClose() {
    this.closed.emit(false);
    this.form.reset({ icon: 'ph-cards' });
  }

  submit() {
    if (this.form.invalid) return;

    if (this.type() === 'CREATE') {
      this.create();
    } else {
      this.update();
    }
  }

  create() {
    this.loading.set(true);

    this.service.create(this.form.value as Partial<CardCollection>).subscribe({
      next: () => {
        this.toast.success('Collection created successfully');
        this.loading.set(false);
        this.closed.emit(true);
        this.submitted.emit();
        this.form.reset({ icon: 'ph-cards' });
      },
      error: (err) => {
        this.toast.error('Error creating collection', err.message);
        this.loading.set(false);
        this.closed.emit(false);
      }
    });
  }

  update() {
    const collectionId = this.collectionId();

    if (!collectionId) return;

    this.loading.set(true);

    this.service.update(collectionId, this.form.value as Partial<CardCollection>).subscribe({
      next: () => {
        this.toast.success('Collection updated successfully');
        this.loading.set(false);
        this.closed.emit(true);
        this.submitted.emit();
        this.form.reset({ icon: 'ph-cards' });
      },
      error: (err) => {
        this.toast.error('Error updating collection', err.message);
        this.loading.set(false);
        this.closed.emit(false);
      }
    });
  }

  onIconSelect(iconName: string) {
    this.form.patchValue({
      icon: iconName
    });
  }
}
