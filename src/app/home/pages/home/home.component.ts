import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../auth/services/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [ButtonModule, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(protected readonly router: Router, protected readonly auth: AuthenticationService) { }
  features = [
    {
      title: 'Flashcards',
      description: 'Create and review smart flashcards with spaced repetition.',
      icon: 'ph ph-cards'
    },
    {
      title: 'Quizzes',
      description: 'Test your memory with adaptive quizzes that challenge you.',
      icon: 'ph ph-question'
    },
    {
      title: 'Progress Tracking',
      description: 'Track your memory growth and visualize your improvement.',
      icon: 'ph ph-chart-line'
    }
  ];
}

