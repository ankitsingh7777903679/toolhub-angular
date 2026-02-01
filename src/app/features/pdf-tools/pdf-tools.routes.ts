import { Routes } from '@angular/router';

export const PDF_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pdf-tools.component').then(m => m.PdfToolsComponent)
    },
    {
        path: 'split',
        loadComponent: () => import('./split/split.component').then(m => m.SplitComponent)
    },
    {
        path: 'merge',
        loadComponent: () => import('./merge/merge.component').then(m => m.MergeComponent)
    },
    {
        path: 'img-to-pdf',
        loadComponent: () => import('./img-to-pdf/img-to-pdf.component').then(m => m.ImgToPdfComponent)
    },
    {
        path: 'html-to-pdf',
        loadComponent: () => import('./html-to-pdf/html-to-pdf.component').then(m => m.HtmlToPdfComponent)
    },
    {
        path: 'compress',
        loadComponent: () => import('./compress/compress.component').then(m => m.CompressComponent)
    },
    {
        path: 'to-image',
        loadComponent: () => import('./pdf-to-image/pdf-to-image.component').then(m => m.PdfToImageComponent)
    },
    {
        path: 'rotate',
        loadComponent: () => import('./rotate/rotate.component').then(m => m.RotateComponent)
    },
    {
        path: 'watermark',
        loadComponent: () => import('./watermark/watermark.component').then(m => m.WatermarkComponent)
    },
    {
        path: 'unlock',
        loadComponent: () => import('./unlock/unlock.component').then(m => m.UnlockComponent)
    },
    {
        path: 'protect',
        loadComponent: () => import('./protect/protect.component').then(m => m.ProtectComponent)
    },
    {
        path: 'ocr',
        loadComponent: () => import('./pdf-to-word/pdf-to-word.component').then(m => m.PdfToWordComponent)
    },

    {
        path: 'word-to-pdf',
        loadComponent: () => import('./word-to-pdf/word-to-pdf.component').then(m => m.WordToPdfComponent)
    }
];
