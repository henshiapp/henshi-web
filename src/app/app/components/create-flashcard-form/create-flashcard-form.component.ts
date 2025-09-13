import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TextareaModule } from 'primeng/textarea';
import { FlashcardsService } from '../../services/flashcards.service';
import { Flashcard } from '../../../core/types/Flashcard';
import { QuillEditorComponent } from 'ngx-quill'
import { finalize } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-create-flashcard-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DrawerModule, ButtonModule, TextareaModule, QuillEditorComponent],
  providers: [MessageService],
  templateUrl: './create-flashcard-form.component.html',
  styleUrl: './create-flashcard-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateFlashcardFormComponent {
  @Input() visible = false;
  @Input() collectionId!: string;
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private service = inject(FlashcardsService);
  private toast = inject(MessageService);
  protected breakpointObserver = inject(BreakpointObserver)

  loading = signal(false)

  form = this.fb.group({
    question: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3000)]],
    answer: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3000)]],
  });

  Breakpoints = Breakpoints;

  onSubmit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.service.create(this.collectionId, this.form.value as Partial<Flashcard>)
      .pipe(finalize(() => {
        this.loading.set(false)
      }))
      .subscribe({
        next: () => {
          this.toast.add({ severity: 'success', summary: 'Created', detail: 'Flashcard created successfully' });
          this.created.emit();
          this.form.reset();
          this.closed.emit();
        },
        error: (err) => {
          this.toast.add({ severity: 'error', summary: 'Error', detail: err.message });
        },
      });
  }
}
