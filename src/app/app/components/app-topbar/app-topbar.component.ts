import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';
import { AuthenticationService } from '../../../auth/services/auth.service';
import { PageTitleService } from '../../../core/services/page-title.service';
import { User } from '@auth0/auth0-angular';
import { SearchService } from '../../../core/services/search.service';

@Component({
  selector: 'app-app-topbar',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AvatarModule,
    MenuModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    RippleModule
  ],
  templateUrl: './app-topbar.component.html',
  styleUrl: './app-topbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppTopbarComponent {
  private pageTitle = inject(PageTitleService);
  private auth = inject(AuthenticationService);

  title = signal<string>('');
  user = signal<User | null | undefined>(null);

  searchCtrl = new FormControl<string>('', { nonNullable: true });
  subs = new Subscription();

  items: MenuItem[] = [
    {
      label: 'Logout',
      icon: 'ph ph-arrow-square-left',
      command: () => this.auth.logout(),
    },
  ];

  constructor() {
    this.subs.add(this.pageTitle.title$.subscribe(t => this.title.set(t)));

    this.subs.add(this.auth.user$.subscribe(u => (this.user.set(u))));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
