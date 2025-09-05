import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, model, Output, signal } from '@angular/core';
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

@Component({
  selector: 'app-create-card-collection-form',
  imports: [
    CommonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    ReactiveFormsModule,
    PopoverModule,
    FormsModule
  ],
  templateUrl: './create-card-collection-form.component.html',
  styleUrl: './create-card-collection-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCardCollectionFormComponent {
  @Input() visible = false;
  @Output() closed = new EventEmitter<boolean>();
  @Output() created = new EventEmitter<void>();
  
  private fb = inject(FormBuilder);
  private service = inject(CardCollectionsService);
  private toast = inject(ToastService);
  
  iconSearch = model<string>('');
  
  form = this.fb.group({
    icon: ['ph-cards', Validators.required],
    title: ['', [Validators.required, Validators.maxLength(30)]],
    description: ['', [Validators.maxLength(255)]]
  });
  icons = icons
  
  submitting = signal(false);
  
  
  handleClose() {
    this.closed.emit(false);
    this.form.reset({ icon: 'ph-cards' });
  }
  
  submit() {
    if (this.form.invalid) return;
    this.submitting.set(true);
    
    this.service.create(this.form.value as Partial<CardCollection>).subscribe({
      next: () => {
        this.toast.success('Collection created successfully');
        this.submitting.set(false);
        this.closed.emit(true);
        this.created.emit();
        this.form.reset({ icon: 'ph-cards' });
      },
      error: (err) => {
        this.toast.error('Error creating collection', err.message);
        this.submitting.set(false);
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
