import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LoadingSpinnerComponent } from "../../../shared/components/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-statistic-card',
  imports: [LoadingSpinnerComponent],
  templateUrl: './statistic-card.component.html',
  styleUrl: './statistic-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticCardComponent {
  title = input.required<string>();
  icon = input.required<string>();
  value = input.required<number>();
  loading = input.required<boolean>();
}
