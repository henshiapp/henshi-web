import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PageTitleService } from '../../../core/services/page-title.service';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  title = inject(PageTitleService);
  breadcrumb = inject(BreadcrumbService);

  ngOnInit() {
    this.title.setTitle('Dashboard');
    this.breadcrumb.set([]);
  }
}
