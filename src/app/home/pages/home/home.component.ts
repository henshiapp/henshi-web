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
  constructor(protected readonly router: Router, protected readonly auth: AuthenticationService) {}
}
