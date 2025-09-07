import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  constructor(protected readonly auth: AuthenticationService) { }

  ngOnInit(): void {
    this.auth.login().subscribe();
  }
}
