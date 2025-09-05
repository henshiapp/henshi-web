import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';

@Component({
  selector: 'app-app-breadcrumb',
  imports: [CommonModule, BreadcrumbModule],
  templateUrl: './app-breadcrumb.component.html',
  styleUrl: './app-breadcrumb.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBreadcrumbComponent {
  private bc = inject(BreadcrumbService);

  items: MenuItem[] = [];
  home: MenuItem = { icon: 'ph ph-house', routerLink: '/' };

  constructor() {
    this.bc.crumbs$.subscribe((crumbs) => {
      this.items = crumbs.map((b, i) => ({
        label: b.label,
        template: () => {
          const isLast = i === crumbs.length - 1;
          return `<a class="${isLast ? 'text-cyan-400' : ''}" href="${b.path}">${b.label}</a>`;
        },
        routerLink: b.path,
      }));
    });
  }
}
