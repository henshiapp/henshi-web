import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TimerComponent } from '../../../../shared/components/timer/timer.component';
import { FlashcardsService } from '../../../services/flashcards.service';
import { LoadingSpinnerComponent } from "../../../../shared/components/loading-spinner/loading-spinner.component";
import { QuillViewComponent } from "ngx-quill";

enum States {
  LOADING = 'LOADING',
  COUNTING = 'COUNTING',
  RUNNING = 'RUNNING',
  FINISHED = 'FINISHED',
}

enum Events {
  FINISHED_LOADING = 'FINISHED_LOADING',
  FINISHED_COUNTING = 'FINISHED_COUNTING',
  ANSWERED_ALL_CARDS = 'ANSWERED_ALL_CARDS',
}

@Component({
  selector: 'app-flashcard-recall',
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    ScrollPanelModule,
    MessageModule,
    ConfirmDialogModule,
    TimerComponent,
    LoadingSpinnerComponent,
    QuillViewComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './flashcard-recall.component.html',
  styleUrl: './flashcard-recall.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlashcardRecallComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  protected flashcardsService = inject(FlashcardsService);
  private message = inject(MessageService);

  state = signal<States>(States.LOADING);
  dispatch = (e: Events) => {
    const s = this.state();
    if (s === States.LOADING && e === Events.FINISHED_LOADING) this.state.set(States.COUNTING);
    else if (s === States.COUNTING && e === Events.FINISHED_COUNTING) this.state.set(States.RUNNING);
    else if (s === States.RUNNING && e === Events.ANSWERED_ALL_CARDS) this.state.set(States.FINISHED);
  };

  private collectionId = this.route.snapshot.paramMap.get('collectionId') ?? '';
  flashcards = this.flashcardsService.flashcardsToRecall;
  loading = this.flashcardsService.loading;
  error = this.flashcardsService.recallError;

  currentIndex = signal(0);
  cardIsFlipped = signal(false);
  cardIsLoading = signal(false);
  recallResults = signal<{ flashcardId: string; correct: boolean }[]>([]);
  hasSaved = false;

  counter = signal(5);
  private countdownTimer: any = null;

  sessionRunning = signal(false);

  currentFlashcard = computed(() => this.flashcards()[this.currentIndex()] ?? null);
  score = computed(() => this.recallResults().filter(r => r.correct).length);
  total = computed(() => this.recallResults().length);

  ngOnInit(): void {
    if (!this.collectionId) {
      this.message.add({ severity: 'error', summary: 'Invalid', detail: 'Invalid collection' });
      return;
    }
    this.flashcardsService.getRecall(this.collectionId);

    const sub = this.flashcardsService.loading;
    const watchId = setInterval(() => {
      if (this.state() === States.LOADING && !this.flashcardsService.loading() && !this.flashcardsService.error() && this.flashcards().length > 0) {
        this.dispatch(Events.FINISHED_LOADING);
        this.startCountdown();
      }
    }, 200);
    this._watchId = watchId;
  }

  private _watchId: any = null;

  ngOnDestroy(): void {
    if (this._watchId) clearInterval(this._watchId);
    this.stopCountdown();
  }

  private startCountdown() {
    this.counter.set(5);
    this.state.set(States.COUNTING);
    this.countdownTimer = setInterval(() => {
      const c = this.counter();
      if (c > 0) {
        this.counter.set(c - 1);
      } else {
        this.stopCountdown();
        this.dispatch(Events.FINISHED_COUNTING);
        this.startSessionTimer();
      }
    }, 1000);
  }

  private stopCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  private startSessionTimer() {
    this.sessionRunning.set(true);
  }

  private stopSessionTimer() {
    this.sessionRunning.set(false);
  }

  flipCard() {
    this.cardIsFlipped.set(!this.cardIsFlipped());
  }

  onCorrectAnswer() {
    const cf = this.currentFlashcard();
    if (!cf) return;
    this.recallResults.set([...this.recallResults(), { flashcardId: cf.id, correct: true }]);
    this.nextCardOrFinish();
  }

  onWrongAnswer() {
    const cf = this.currentFlashcard();
    if (!cf) return;
    this.recallResults.set([...this.recallResults(), { flashcardId: cf.id, correct: false }]);
    this.nextCardOrFinish();
  }

  private nextCardOrFinish() {
    const idx = this.currentIndex();
    const totalCount = this.flashcards().length;
    if (idx < totalCount - 1) {
      this.cardIsFlipped.set(false);
      this.cardIsLoading.set(true);
      setTimeout(() => {
        this.currentIndex.set(idx + 1);
        this.cardIsLoading.set(false);
      }, 500);
    } else {
      this.dispatch(Events.ANSWERED_ALL_CARDS);
      this.onFinished();
    }
  }

  private onFinished() {
    if (this.state() !== States.FINISHED) return;
    if (this.hasSaved) return;
    this.stopSessionTimer();
    const answers = this.recallResults();
    this.flashcardsService.finishRecall(this.collectionId, answers).subscribe({
      next: () => {
        this.hasSaved = true;
        this.flashcardsService.getRecall(this.collectionId);
      },
      error: (err) => {
        this.message.add({ severity: 'error', summary: 'Save failed', detail: err.message });
      }
    });
  }

  // template helpers
  getCounter() { return this.counter(); }
  isLoadingState() { return this.state() === States.LOADING; }
  isCountingState() { return this.state() === States.COUNTING; }
  isRunningState() { return this.state() === States.RUNNING; }
  isFinishedState() { return this.state() === States.FINISHED; }
}
