import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, EventEmitter, inject, input, Input, model, Output, signal } from '@angular/core';
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
  selector: 'app-flashcard-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DrawerModule, ButtonModule, TextareaModule, QuillEditorComponent],
  providers: [MessageService],
  templateUrl: './flashcard-form.component.html',
  styleUrl: './flashcard-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlashcardFormComponent {
  type = input.required<'CREATE' | 'UPDATE'>();
  visible = model<boolean>(false);
  collectionId = input.required<string>();
  flashcardId = input<string | null>(null);
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private service = inject(FlashcardsService);
  private toast = inject(MessageService);
  protected breakpointObserver = inject(BreakpointObserver)

  loading = signal(false)
  flashcard = signal<Flashcard | null>(null);

  form = this.fb.group({
    question: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3000)]],
    answer: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(3000)]],
  });

  Breakpoints = Breakpoints;

  constructor() {
    effect(() => {
      const flashcardId = this.flashcardId();

      if (this.type() === 'UPDATE' && flashcardId) {
        this.service.getById(this.collectionId(), flashcardId).subscribe({
          next: ({ data: flashcard }) => {
            this.flashcard.set(flashcard);
            this.form.setValue({
              question: flashcard.question,
              answer: flashcard.answer
            })
          }
        });
      }
    })
  }

  onSubmit() {
    if (this.form.invalid) return;

    if (this.type() === 'CREATE') {
      this.create()
    } else {
      this.update()
    }
  }

  create() {
    this.loading.set(true);
    this.service.create(this.collectionId(), this.form.value as Partial<Flashcard>)
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

  update() {
    const flashcardId = this.flashcardId();

    if (!flashcardId) return;

    this.loading.set(true);
    this.service.update(this.collectionId(), flashcardId, this.form.value as Partial<Flashcard>)
      .pipe(finalize(() => {
        this.loading.set(false)
      }))
      .subscribe({
        next: () => {
          this.toast.add({ severity: 'success', summary: 'Updated', detail: 'Flashcard updated successfully' });
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
