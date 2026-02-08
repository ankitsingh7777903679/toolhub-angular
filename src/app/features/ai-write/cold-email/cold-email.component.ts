import { Component, inject } from '@angular/core';
import { SeoService } from '../../../core/services/seo.service';
import { AiWriterComponent } from '../shared/ai-writer/ai-writer.component';

@Component({
    selector: 'app-cold-email',
    standalone: true,
    imports: [AiWriterComponent],
    template: `
        <app-ai-writer [config]="config"></app-ai-writer>
    `
})
export class ColdEmailComponent {
    private seoService = inject(SeoService);

    constructor() {
        this.seoService.updateSeo({
            title: 'Free AI Cold Email Generator - Write High-Converting Outreach Emails',
            description: 'Generate personalized cold emails for sales, jobs, and networking. Boost your open rates and responses with our free AI cold email writer.',
            keywords: 'cold email generator, ai email writer, cold email outreach, sales outreach automation, personalized cold emails, automated email campaigns, email marketing tool, free cold email template',
            url: 'https://2olhub.netlify.app/write/cold-email'
        });
    }

    config = {
        promptType: 'coldEmail',
        title: 'AI Cold Email Generator',
        subtitle: 'Generate professional cold emails that get responses',
        placeholder: 'Describe your cold email... e.g., "Write a cold email to a marketing manager about our social media management tool"',
        showParagraphs: false,
        iconClass: 'fa-solid fa-envelope',
        iconColor: '#EC4899',
        bgColor: '#FCE7F3',
        // SEO Content
        seoTitle: 'Free AI Cold Email Generator - Write Emails That Get Replies',
        seoIntro: 'Create compelling cold emails for sales outreach, business development, and networking. Our AI crafts personalized, professional emails that boost your response rates.',
        features: [
            { icon: 'fa-solid fa-bullseye', title: 'High-Converting', description: 'Emails designed to maximize open and reply rates.' },
            { icon: 'fa-solid fa-user-tie', title: 'Professional Tone', description: 'Polished, business-appropriate language.' },
            { icon: 'fa-solid fa-handshake', title: 'Personalization', description: 'Easily customize for specific prospects.' },
            { icon: 'fa-solid fa-clock', title: 'Save Hours', description: 'Generate dozens of emails in minutes.' },
            { icon: 'fa-solid fa-chart-line', title: 'Proven Templates', description: 'Based on high-performing email structures.' },
            { icon: 'fa-solid fa-edit', title: 'Easy to Customize', description: 'Quick copy and personalize workflow.' }
        ],
        useCases: [
            'Sales teams doing prospect outreach',
            'Recruiters reaching out to candidates',
            'Freelancers pitching new clients',
            'Startups seeking partnerships or investors'
        ],
        faqs: [
            { question: 'What makes a cold email effective?', answer: 'Effective cold emails are personalized, concise, offer clear value to the recipient, and include a specific call-to-action. Our AI incorporates these best practices.' },
            { question: 'How do I personalize the generated email?', answer: 'Replace placeholder text with specific details about your prospect - their name, company, recent achievements, or pain points you can address.' },
            { question: 'Can I generate follow-up emails?', answer: 'Yes! Just specify in your prompt that you need a follow-up email and mention the context of your initial outreach.' },
            { question: 'Will this work for any industry?', answer: 'Absolutely. Describe your industry, product/service, and target audience in your prompt for industry-specific results.' }
        ]
    };
}
