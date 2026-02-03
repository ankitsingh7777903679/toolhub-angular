import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./admin.component').then(m => m.AdminComponent),
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'users',
                loadComponent: () => import('./users/users.component').then(m => m.UsersComponent)
            },
            {
                path: 'add-tool',
                loadComponent: () => import('./add-tool/add-tool.component').then(m => m.AddToolComponent)
            },
            {
                path: 'deleted-users',
                loadComponent: () => import('./deleted-users/deleted-users.component').then(m => m.DeletedUsersComponent)
            },
            {
                path: 'analytics',
                loadComponent: () => import('./tool-analytics/tool-analytics.component').then(m => m.ToolAnalyticsComponent)
            }
        ]
    }
];
