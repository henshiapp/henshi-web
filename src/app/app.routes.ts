import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { AppLayoutComponent } from './app/layouts/app/app-layout/app-layout.component';
import { LoginComponent } from './auth/pages/login/login.component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/pages/home/home.component').then(c => c.HomeComponent)
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                component: LoginComponent
            }
        ]
    },
    {
        path: 'app',
        component: AppLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./app/pages/dashboard/dashboard.component').then(c => c.DashboardComponent)
            },
            {
                path: 'card-collections',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        loadComponent: () => import('./app/pages/flashcards/card-collections/card-collections.component').then(c => c.CardCollectionsComponent),
                    },
                    {
                        path: ':collectionId/flashcards',
                        children: [
                            {
                                path: '',
                                pathMatch: 'full',
                                loadComponent: () => import('./app/pages/flashcards/flashcards/flashcards.component').then(c => c.FlashcardsComponent),
                            },
                            {
                                path: 'recall',
                                loadComponent: () => import('./app/pages/flashcards/flashcard-recall/flashcard-recall.component').then(c => c.FlashcardRecallComponent),
                            }
                        ]
                    }
                ]
            },
            {
                path: 'app',
                pathMatch: 'full',
                redirectTo: 'app/dashboard',
            },
            {
                path: '**',
                redirectTo: 'app/dashboard',
            },
        ]
    },
    {
        path: '**',
        redirectTo: '',
    },
];
