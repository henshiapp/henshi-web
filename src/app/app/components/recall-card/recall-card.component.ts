import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recall-card',
  imports: [LoadingSpinnerComponent, CommonModule],
  templateUrl: './recall-card.component.html',
  styleUrl: './recall-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecallCardComponent { 
  @Input() text = '';
  @Input() side: 'FRONT' | 'BACK' = 'FRONT';
  @Input() isLoading = false;
}
