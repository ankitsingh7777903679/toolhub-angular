import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'about',
        loadComponent: () => import('./features/pages/about/about.component').then(m => m.AboutComponent)
    },
    {
        path: 'terms',
        loadComponent: () => import('./features/pages/terms/terms.component').then(m => m.TermsComponent)
    },
    {
        path: 'privacy',
        loadComponent: () => import('./features/pages/privacy/privacy.component').then(m => m.PrivacyComponent)
    },
    {
        path: 'feedback',
        loadComponent: () => import('./features/pages/feedback/feedback.component').then(m => m.FeedbackComponent)
    },
    {
        path: 'pdf',
        loadChildren: () => import('./features/pdf-tools/pdf-tools.routes').then(m => m.PDF_ROUTES)
    },
    {
        path: 'image',
        loadChildren: () => import('./features/image-tools/image-tools.routes').then(m => m.IMAGE_ROUTES)
    },
    {
        path: 'write',
        loadChildren: () => import('./features/ai-write/ai-write.routes').then(m => m.WRITE_ROUTES)
    },
    {
        path: 'file',
        loadChildren: () => import('./features/file-tools/file-tools.routes').then(m => m.FILE_ROUTES)
    },
    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
        canActivate: [adminGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
