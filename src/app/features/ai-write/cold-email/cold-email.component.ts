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
        this.seoService.setFaqJsonLd([
            { question: 'What actually makes a cold email work?', answer: 'Keep it short — 3-5 sentences max. Lead with something specific about them (not about you), explain your value in one line, and end with a clear ask. The AI follows this structure.' },
            { question: 'How do I make it sound less generic?', answer: 'After generating, replace the bracketed placeholders with real details — their name, company, a recent achievement, or a specific problem you can solve. That\'s what turns a template into a real email.' },
            { question: 'Can it write follow-up emails too?', answer: 'Absolutely. Just say something like "write a follow-up email after no response to my initial pitch about X." It\'ll keep the context and adjust the tone.' },
            { question: 'Does it work for industries outside tech?', answer: 'Yes — real estate, consulting, healthcare, SaaS, agencies, you name it. Describe your industry and product in the prompt and the output adapts.' }
        ]);
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
        seoTitle: 'AI Cold Email Generator — Write Outreach That Gets Replies',
        seoIntro: 'Writing cold emails is painful. You agonize over every word, second-guess the subject line, and still end up with something that sounds like every other sales pitch in their inbox. This tool gives you a solid draft in seconds — personalized, concise, and structured the way high-converting emails actually work.',
        features: [
            { icon: 'fa-solid fa-bullseye', title: 'Gets to the Point', description: 'Short, focused emails that respect the reader\'s time.' },
            { icon: 'fa-solid fa-user-tie', title: 'Sounds Professional', description: 'Business-appropriate without being stiff or robotic.' },
            { icon: 'fa-solid fa-handshake', title: 'Easy to Personalize', description: 'Swap in prospect details and make it yours in 30 seconds.' },
            { icon: 'fa-solid fa-clock', title: 'Saves Hours', description: 'Stop staring at Gmail — generate dozens of variations quickly.' },
            { icon: 'fa-solid fa-chart-line', title: 'Proven Structure', description: 'Hook, value prop, call-to-action — the format that works.' },
            { icon: 'fa-solid fa-edit', title: 'Tweak and Send', description: 'Copy, customize a few lines, and hit send.' }
        ],
        useCases: [
            'Sales reps who send 50+ cold emails a week and need fresh angles',
            'Recruiters reaching out to candidates who ignore generic InMails',
            'Freelancers pitching potential clients without sounding desperate',
            'Founders reaching out to investors or potential partners'
        ],
        faqs: [
            { question: 'What actually makes a cold email work?', answer: 'Keep it short — 3-5 sentences max. Lead with something specific about them (not about you), explain your value in one line, and end with a clear ask. The AI follows this structure.' },
            { question: 'How do I make it sound less generic?', answer: 'After generating, replace the bracketed placeholders with real details — their name, company, a recent achievement, or a specific problem you can solve. That\'s what turns a template into a real email.' },
            { question: 'Can it write follow-up emails too?', answer: 'Absolutely. Just say something like "write a follow-up email after no response to my initial pitch about X." It\'ll keep the context and adjust the tone.' },
            { question: 'Does it work for industries outside tech?', answer: 'Yes — real estate, consulting, healthcare, SaaS, agencies, you name it. Describe your industry and product in the prompt and the output adapts.' }
        ]
    };
}
