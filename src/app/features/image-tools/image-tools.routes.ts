import { Routes } from '@angular/router';

export const IMAGE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./image-tools.component').then(m => m.ImageToolsComponent)
    },
    {
        path: 'ai-generator',
        loadComponent: () => import('./ai-generator/ai-generator.component').then(m => m.AiGeneratorComponent)
    },
    {
        path: 'webp-to-jpg',
        loadComponent: () => import('./webp-to-jpg/webp-to-jpg.component').then(m => m.WebpToJpgComponent)
    },
    {
        path: 'jpg-to-png',
        loadComponent: () => import('./jpg-to-png/jpg-to-png.component').then(m => m.JpgToPngComponent)
    },
    {
        path: 'png-to-jpg',
        loadComponent: () => import('./png-to-jpg/png-to-jpg.component').then(m => m.PngToJpgComponent)
    },
    {
        path: 'to-base64',
        loadComponent: () => import('./image-to-base64/image-to-base64.component').then(m => m.ImageToBase64Component)
    },
    {
        path: 'compress',
        loadComponent: () => import('./image-compressor/image-compressor.component').then(m => m.ImageCompressorComponent)
    },
    {
        path: 'enhance',
        loadComponent: () => import('./image-enhancer/image-enhancer.component').then(m => m.ImageEnhancerComponent)
    },
    {
        path: 'remove-bg',
        loadComponent: () => import('./remove-bg/remove-bg.component').then(m => m.RemoveBgComponent)
    },
    {
        path: 'resize',
        loadComponent: () => import('./resize-image/resize-image.component').then(m => m.ResizeImageComponent)
    },
    {
        path: 'crop',
        loadComponent: () => import('./crop-image/crop-image.component').then(m => m.CropImageComponent)
    },
    {
        path: 'watermark',
        loadComponent: () => import('./watermark/watermark.component').then(m => m.WatermarkComponent)
    },
    {
        path: 'blur',
        loadComponent: () => import('./blur-image/blur-image.component').then(m => m.BlurImageComponent)
    },
    {
        path: 'rotate',
        loadComponent: () => import('./rotate-image/rotate-image.component').then(m => m.RotateImageComponent)
    }
];
