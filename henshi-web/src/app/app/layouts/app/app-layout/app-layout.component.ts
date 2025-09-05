import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { AppSidebarComponent } from '../../../components/app-sidebar/app-sidebar.component';
import { AppTopbarComponent } from '../../../components/app-topbar/app-topbar.component';
import { AppBreadcrumbComponent } from '../../../components/app-breadcrumb/app-breadcrumb.component';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, AppSidebarComponent, AppTopbarComponent, AppBreadcrumbComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayoutComponent { }
