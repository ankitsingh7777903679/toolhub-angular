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
            iconClass: 'fa-solid fa-paragraph',
            seoTitle: 'Free AI Paragraph Generator - Write Any Paragraph Instantly',
            seoIntro: 'Generate well-written, coherent paragraphs on any topic in seconds. Perfect for essays, articles, and content creation.',
            features: [
                { icon: 'fa-solid fa-feather', title: 'Natural Flow', description: 'Smooth, readable sentences that connect logically.' },
                { icon: 'fa-solid fa-bullseye', title: 'On Topic', description: 'Stays focused on your specified subject.' },
                { icon: 'fa-solid fa-text-height', title: 'Proper Length', description: 'Well-balanced paragraphs, not too short or long.' },
                { icon: 'fa-solid fa-language', title: 'Great Grammar', description: 'Grammatically correct, professional output.' },
                { icon: 'fa-solid fa-bolt', title: 'Instant Results', description: 'Get paragraphs in seconds, not minutes.' },
                { icon: 'fa-solid fa-infinity', title: 'Unlimited Use', description: 'Generate as many paragraphs as you need.' }
            ],
            useCases: ['Essay introductions and conclusions', 'Article body content', 'Report sections', 'Website copy'],
            faqs: [
                { question: 'How long are the generated paragraphs?', answer: 'Typically 4-8 sentences (100-200 words). You can request specific lengths in your prompt.' },
                { question: 'Can I specify a writing style?', answer: 'Yes! Include style preferences in your prompt like "formal", "casual", or "academic".' },
                { question: 'Is the content unique?', answer: 'Each generation creates original content based on your specific prompt.' }
            ]
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
            iconClass: 'fa-solid fa-rotate',
            seoTitle: 'Free AI Article Rewriter - Paraphrase Text Instantly',
            seoIntro: 'Rewrite articles, essays, and content while maintaining the original meaning. Create unique versions for SEO, avoid plagiarism, and improve readability.',
            features: [
                { icon: 'fa-solid fa-shuffle', title: 'Smart Paraphrasing', description: 'Changes words and structure while keeping meaning.' },
                { icon: 'fa-solid fa-shield-check', title: 'Plagiarism-Free', description: 'Creates unique content safe from detection.' },
                { icon: 'fa-solid fa-text-slash', title: 'Maintains Meaning', description: 'Core message stays intact after rewriting.' },
                { icon: 'fa-solid fa-spell-check', title: 'Improves Quality', description: 'Often makes content more readable.' },
                { icon: 'fa-solid fa-bolt', title: 'Fast Processing', description: 'Rewrite long articles in seconds.' },
                { icon: 'fa-solid fa-file-lines', title: 'Any Length', description: 'Works with paragraphs to full articles.' }
            ],
            useCases: ['Making content unique for SEO', 'Avoiding plagiarism in writing', 'Repurposing existing content', 'Improving text readability'],
            faqs: [
                { question: 'Will the rewritten text pass plagiarism checkers?', answer: 'Our AI creates substantially different text, but we recommend always running important content through plagiarism checkers.' },
                { question: 'Does it change the meaning?', answer: 'The AI preserves core meaning while changing words and sentence structure.' },
                { question: 'Can I rewrite in a specific style?', answer: 'Yes, specify "make it more formal" or "simplify this" for style changes.' }
            ]
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
            iconClass: 'fa-solid fa-spell-check',
            seoTitle: 'Free AI Grammar Checker - Fix Errors Instantly',
            seoIntro: 'Check and correct grammar, spelling, and punctuation errors. Get polished, error-free text in seconds.',
            features: [
                { icon: 'fa-solid fa-spell-check', title: 'Grammar Fix', description: 'Corrects subject-verb agreement and more.' },
                { icon: 'fa-solid fa-text-slash', title: 'Spelling Check', description: 'Catches typos and misspellings.' },
                { icon: 'fa-solid fa-ellipsis', title: 'Punctuation', description: 'Fixes commas, periods, and quotes.' },
                { icon: 'fa-solid fa-align-left', title: 'Sentence Flow', description: 'Improves sentence structure.' },
                { icon: 'fa-solid fa-bolt', title: 'Instant Check', description: 'Results in seconds.' },
                { icon: 'fa-solid fa-copy', title: 'Easy Copy', description: 'One-click copy corrected text.' }
            ],
            useCases: ['Email proofreading', 'Academic paper review', 'Business document checking', 'Blog post editing'],
            faqs: [
                { question: 'What errors does it catch?', answer: 'Grammar, spelling, punctuation, capitalization, and basic sentence structure issues.' },
                { question: 'Will it change my writing style?', answer: 'It focuses on errors, not style. Your voice remains intact.' },
                { question: 'Can I check any language?', answer: 'Currently optimized for English text.' }
            ]
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
            iconClass: 'fa-solid fa-sliders',
            seoTitle: 'Free AI Tone Changer - Adjust Writing Style Instantly',
            seoIntro: 'Transform your writing tone from casual to professional, friendly to formal, or any style you need. Perfect for adapting content for different audiences.',
            features: [
                { icon: 'fa-solid fa-user-tie', title: 'Professional', description: 'Make text business-appropriate.' },
                { icon: 'fa-solid fa-smile', title: 'Friendly', description: 'Add warmth and approachability.' },
                { icon: 'fa-solid fa-graduation-cap', title: 'Academic', description: 'Formal, scholarly language.' },
                { icon: 'fa-solid fa-lightbulb', title: 'Persuasive', description: 'Compelling, action-oriented.' },
                { icon: 'fa-solid fa-child', title: 'Simplified', description: 'Easy to understand for all.' },
                { icon: 'fa-solid fa-bolt', title: 'Instant Change', description: 'Transform tone in seconds.' }
            ],
            useCases: ['Making emails more professional', 'Softening harsh messages', 'Adapting content for different platforms', 'Matching brand voice'],
            faqs: [
                { question: 'What tones can it create?', answer: 'Professional, casual, friendly, formal, academic, persuasive, empathetic, and more.' },
                { question: 'Does it keep the meaning?', answer: 'Yes, the core message stays the same - only the delivery changes.' },
                { question: 'How do I specify the tone?', answer: 'Include your target tone in the prompt, e.g., "Make this more friendly and casual".' }
            ]
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
            iconClass: 'fa-solid fa-box',
            seoTitle: 'Free AI Product Description Generator - Write Descriptions That Sell',
            seoIntro: 'Create compelling product descriptions for e-commerce, Amazon, Shopify, and marketplaces. Convert browsers into buyers with persuasive copy.',
            features: [
                { icon: 'fa-solid fa-cart-shopping', title: 'Sales-Focused', description: 'Copy designed to convert shoppers.' },
                { icon: 'fa-solid fa-bullseye', title: 'Benefit Highlights', description: 'Emphasizes what customers care about.' },
                { icon: 'fa-solid fa-magnifying-glass', title: 'SEO Optimized', description: 'Keywords for search visibility.' },
                { icon: 'fa-solid fa-store', title: 'Platform Ready', description: 'Works for Amazon, Shopify, eBay.' },
                { icon: 'fa-solid fa-bolt', title: 'Instant Generate', description: 'Descriptions in seconds.' },
                { icon: 'fa-solid fa-pen', title: 'Easy Customize', description: 'Edit to match your brand.' }
            ],
            useCases: ['Amazon product listings', 'Shopify store descriptions', 'eBay item listings', 'Marketing catalog copy'],
            faqs: [
                { question: 'What info should I provide?', answer: 'Product name, key features, specifications, target audience, and any unique selling points.' },
                { question: 'Are descriptions SEO-friendly?', answer: 'Yes, the AI naturally incorporates relevant keywords.' },
                { question: 'Can I generate for different platforms?', answer: 'Specify the platform in your prompt for optimized output.' }
            ]
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
            iconClass: 'fa-solid fa-hashtag',
            seoTitle: 'Free AI Social Media Post Generator - Create Viral Content',
            seoIntro: 'Generate engaging posts for Twitter, LinkedIn, Instagram, and Facebook. Get likes, shares, and engagement with AI-crafted social content.',
            features: [
                { icon: 'fa-brands fa-twitter', title: 'Twitter/X Ready', description: 'Optimal length with hooks.' },
                { icon: 'fa-brands fa-linkedin', title: 'LinkedIn Pro', description: 'Professional thought leadership.' },
                { icon: 'fa-brands fa-instagram', title: 'Instagram Captions', description: 'Engaging with emoji and hashtags.' },
                { icon: 'fa-solid fa-hashtag', title: 'Hashtag Suggestions', description: 'Relevant tags for reach.' },
                { icon: 'fa-solid fa-fire', title: 'Engagement Hooks', description: 'Attention-grabbing openings.' },
                { icon: 'fa-solid fa-bolt', title: 'Multiple Versions', description: 'Try different angles quickly.' }
            ],
            useCases: ['Product announcements', 'Thought leadership content', 'Promotional posts', 'Community engagement'],
            faqs: [
                { question: 'Which platforms does it support?', answer: 'Twitter/X, LinkedIn, Instagram, Facebook, TikTok - specify in your prompt.' },
                { question: 'Does it include hashtags?', answer: 'Yes, when appropriate for the platform. You can request specific hashtags.' },
                { question: 'Can I create multiple versions?', answer: 'Yes, ask for variations or run it multiple times for options.' }
            ]
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
            iconClass: 'fa-solid fa-book',
            seoTitle: 'Free AI Story Generator - Create Stories on Any Topic',
            seoIntro: 'Generate creative stories, short fiction, and narratives instantly. Perfect for writers, students, and anyone who loves storytelling.',
            features: [
                { icon: 'fa-solid fa-wand-magic-sparkles', title: 'Creative Plots', description: 'Unique storylines and twists.' },
                { icon: 'fa-solid fa-users', title: 'Rich Characters', description: 'Memorable, developed personas.' },
                { icon: 'fa-solid fa-masks-theater', title: 'Any Genre', description: 'Fantasy, sci-fi, romance, mystery.' },
                { icon: 'fa-solid fa-pen-fancy', title: 'Vivid Writing', description: 'Descriptive, engaging prose.' },
                { icon: 'fa-solid fa-book-open', title: 'Complete Arc', description: 'Beginning, middle, and end.' },
                { icon: 'fa-solid fa-bolt', title: 'Instant Stories', description: 'Full stories in seconds.' }
            ],
            useCases: ['Creative writing inspiration', 'Bedtime stories for kids', 'Writing prompts and exercises', 'Content for storytelling apps'],
            faqs: [
                { question: 'What genres can it write?', answer: 'Fantasy, sci-fi, romance, mystery, horror, adventure, comedy, drama, and more.' },
                { question: 'How long are the stories?', answer: 'Short stories of 500-1000 words. Request specific lengths for different results.' },
                { question: 'Can I continue a story?', answer: 'Yes! Paste the existing story and ask to continue or expand it.' }
            ]
        }
    }
];
