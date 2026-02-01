import { Routes } from '@angular/router';

export const WRITE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./ai-write.component').then(m => m.AiWriteComponent)
    },
    {
        path: 'cold-email',
        loadComponent: () => import('./cold-email/cold-email.component').then(m => m.ColdEmailComponent)
    },
    {
        path: 'essay',
        loadComponent: () => import('./essay/essay.component').then(m => m.EssayComponent)
    },
    {
        path: 'blog',
        loadComponent: () => import('./blog/blog.component').then(m => m.BlogComponent)
    },
    {
        path: 'summarizer',
        loadComponent: () => import('./summarizer/summarizer.component').then(m => m.SummarizerComponent)
    },
    {
        path: 'json-to-xml',
        loadComponent: () => import('./json-to-xml/json-to-xml.component').then(m => m.JsonToXmlComponent)
    },
    {
        path: 'paragraph',
        loadComponent: () => import('./shared/generic-write/generic-write.component').then(m => m.GenericWriteComponent),
        data: {
            title: 'Paragraph Writer',
            description: 'Generate coherent and engaging paragraphs on any topic.',
            promptType: 'paragraph',
            inputLabel: 'What should the paragraph be about?',
            inputPlaceholder: 'E.g., The benefits of daily exercise...',
            headerBgColor: '#DBEAFE',
            iconColor: '#3B82F6',
            iconClass: 'fa-solid fa-paragraph'
        }
    },
    {
        path: 'rewriter',
        loadComponent: () => import('./shared/generic-write/generic-write.component').then(m => m.GenericWriteComponent),
        data: {
            title: 'Article Rewriter',
            description: 'Rewrite content to improve clarity and uniqueness.',
            promptType: 'rewriter',
            inputLabel: 'Paste the content you want to rewrite',
            inputPlaceholder: 'Paste article or text here...',
            headerBgColor: '#FFEDD5',
            iconColor: '#F97316',
            iconClass: 'fa-solid fa-rotate'
        }
    },
    {
        path: 'grammar',
        loadComponent: () => import('./shared/generic-write/generic-write.component').then(m => m.GenericWriteComponent),
        data: {
            title: 'Grammar Checker',
            description: 'Fix grammar, punctuation, and spelling errors.',
            promptType: 'grammar',
            inputLabel: 'Paste text to check',
            inputPlaceholder: 'Type or paste text here...',
            headerBgColor: '#DCFCE7',
            iconColor: '#22C55E',
            iconClass: 'fa-solid fa-spell-check'
        }
    },
    {
        path: 'tone',
        loadComponent: () => import('./shared/generic-write/generic-write.component').then(m => m.GenericWriteComponent),
        data: {
            title: 'Tone Changer',
            description: 'Adjust the tone of your writing (Professional, Friendly, etc).',
            promptType: 'tone',
            inputLabel: 'Original text and target tone',
            inputPlaceholder: 'E.g., "Make this sound more professional: Hey guys..."',
            headerBgColor: '#FEE2E2',
            iconColor: '#EF4444',
            iconClass: 'fa-solid fa-sliders'
        }
    },
    {
        path: 'product',
        loadComponent: () => import('./shared/generic-write/generic-write.component').then(m => m.GenericWriteComponent),
        data: {
            title: 'Product Description',
            description: 'Create compelling product descriptions that sell.',
            promptType: 'product',
            inputLabel: 'Product Name and Details',
            inputPlaceholder: 'E.g., Wireless Noise Cancelling Headphones, 30h battery life...',
            headerBgColor: '#E0F2FE',
            iconColor: '#0EA5E9',
            iconClass: 'fa-solid fa-box'
        }
    },
    {
        path: 'social',
        loadComponent: () => import('./shared/generic-write/generic-write.component').then(m => m.GenericWriteComponent),
        data: {
            title: 'Social Media Post',
            description: 'Generate engaging posts for Twitter, LinkedIn, etc.',
            promptType: 'social',
            inputLabel: 'Topic or Link',
            inputPlaceholder: 'E.g., New feature launch for our app...',
            headerBgColor: '#EDE9FE',
            iconColor: '#7C3AED',
            iconClass: 'fa-solid fa-hashtag'
        }
    },
    {
        path: 'story',
        loadComponent: () => import('./shared/generic-write/generic-write.component').then(m => m.GenericWriteComponent),
        data: {
            title: 'Story Generator',
            description: 'Write creative stories based on your prompt.',
            promptType: 'story',
            inputLabel: 'Story Prompt or Idea',
            inputPlaceholder: 'E.g., A robot who discovers emotions...',
            headerBgColor: '#FAE8FF',
            iconColor: '#D946EF',
            iconClass: 'fa-solid fa-book'
        }
    }
];
