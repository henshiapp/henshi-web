import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
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
  private router = inject(Router);
  private pageTitle = inject(PageTitleService);
  private auth = inject(AuthenticationService);

  title = '...';
  user?: User | null = null;

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
    this.subs.add(this.pageTitle.title$.subscribe(t => (this.title = t)));

    this.subs.add(this.auth.user$.subscribe(u => (this.user = u)));

    this.subs.add(
      this.searchCtrl.valueChanges
        .pipe(debounceTime(400), distinctUntilChanged())
        .subscribe((search) => {
          const trimmed = (search ?? '').trim();
          if (trimmed) {
            this.router.navigate([], {
              queryParams: { page: '1', search: trimmed },
              queryParamsHandling: 'merge',
            });
          } else {
            // remove "search"
            this.router.navigate([], {
              queryParams: { search: null },
              queryParamsHandling: 'merge',
            });
          }
        }),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  get userFirstLetter() {
    return this.user?.given_name?.[0] ?? '';
  }
}
