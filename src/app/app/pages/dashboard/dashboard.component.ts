import { DashboardService } from './../../services/dashboard.service';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PageTitleService } from '../../../core/services/page-title.service';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { StatisticCardComponent } from '../../components/statistic-card/statistic-card.component';

@Component({
  selector: 'app-dashboard',
  imports: [StatisticCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  title = inject(PageTitleService);
  breadcrumb = inject(BreadcrumbService);
  dashboardService = inject(DashboardService)

  ngOnInit() {
    this.title.setTitle('Dashboard');
    this.breadcrumb.set([]);

    this.dashboardService.getStats();
  }
}
