import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-timer',
  imports: [],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css',
})
export class TimerComponent implements OnChanges {
  @Input() isRunning = false;

  private startedAt = 0;
  private elapsedBefore = 0;
  private intervalId: any = null;
  elapsed = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isRunning']) {
      if (this.isRunning) {
        this.start();
      } else {
        this.stop();
      }
    }
  }

  private start() {
    this.startedAt = Date.now();
    this.intervalId = setInterval(() => {
      this.elapsed = this.elapsedBefore + Math.floor((Date.now() - this.startedAt) / 1000);
    }, 250);
  }

  private stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.elapsedBefore = this.elapsed;
  }

  get hh() {
    return String(Math.floor(this.elapsed / 3600)).padStart(2, '0');
  }
  get mm() {
    return String(Math.floor((this.elapsed % 3600) / 60)).padStart(2, '0');
  }
  get ss() {
    return String(this.elapsed % 60).padStart(2, '0');
  }
}