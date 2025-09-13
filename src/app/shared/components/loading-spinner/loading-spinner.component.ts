import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner'

@Component({
  selector: 'app-loading-spinner',
  imports: [ProgressSpinner],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent {
  fontSize = input(35);
}
