import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ROUTES } from '../../routes';

type MenuItem = { name: string; icon: string; path: string; };
type MenuSection = { name: string; children: MenuItem[]; };

@Component({
  selector: 'app-app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './app-sidebar.component.html',
  styleUrl: './app-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppSidebarComponent {
  menu = signal<MenuSection[]>([
    {
      name: 'MAIN',
      children: [
        { name: 'Dashboard',   icon: 'ph ph-squares-four', path: ROUTES.dashboard },
        { name: 'Flashcards',  icon: 'ph ph-cards',        path: ROUTES.cardCollections },
      ],
    },
  ]);

  currentPath = computed(() => this.router.url);

  constructor(private router: Router) {}
 }
