import { Component, inject } from '@angular/core';
import { SeoService } from '../../../core/services/seo.service';
import { AiWriterComponent } from '../shared/ai-writer/ai-writer.component';

@Component({
  selector: 'app-summarizer',
  standalone: true,
  imports: [AiWriterComponent],
  template: `
        <app-ai-writer [config]="config"></app-ai-writer>
    `
})
export class SummarizerComponent {
  private seoService = inject(SeoService);

  constructor() {
    this.seoService.updateSeo({
      title: 'Free AI Text Summarizer - Summarize Articles & Documents Instantly',
      description: 'Turn long articles, research papers, and documents into concise summaries. Save hours of reading time with AI-powered summarization.',
      keywords: 'ai text summarizer, text summarization ai, ai summarizer, summarize articles, summarize documents, condense text, extract key points, summary generator, free ai summarizer',
      url: 'https://2olhub.netlify.app/write/summarizer'
    });
  }

  config = {
    promptType: 'summarize',
    title: 'AI Content Summarizer',
    subtitle: 'Summarize long articles, documents, and text instantly',
    placeholder: 'Paste the text you want to summarize... e.g., paste an article or document and get a concise summary',
    showParagraphs: false,
    iconClass: 'fa-solid fa-compress',
    iconColor: '#8B5CF6',
    bgColor: '#EDE9FE',
    // SEO Content
    seoTitle: 'Free AI Text Summarizer - Summarize Articles & Documents Instantly',
    seoIntro: 'Turn long articles, research papers, and documents into concise summaries. Save hours of reading time with AI-powered summarization.',
    features: [
      { icon: 'fa-solid fa-compress', title: 'Concise Output', description: 'Get key points without the fluff.' },
      { icon: 'fa-solid fa-file-lines', title: 'Any Length', description: 'Summarize texts of any size.' },
      { icon: 'fa-solid fa-bullseye', title: 'Key Points', description: 'AI identifies the most important information.' },
      { icon: 'fa-solid fa-bolt', title: 'Instant Results', description: 'Summaries generated in seconds.' },
      { icon: 'fa-solid fa-graduation-cap', title: 'Study Aid', description: 'Perfect for research and learning.' },
      { icon: 'fa-solid fa-briefcase', title: 'Business Ready', description: 'Summarize reports, emails, and memos.' }
    ],
    useCases: [
      'Students summarizing research papers',
      'Professionals reviewing long reports',
      'Researchers processing multiple articles',
      'Content curators creating article roundups'
    ],
    faqs: [
      { question: 'How long can the input text be?', answer: 'You can paste several thousand words. For very long documents, consider breaking them into sections.' },
      { question: 'What types of content can it summarize?', answer: 'Articles, research papers, reports, emails, meeting notes, blog posts, and any text-based content.' },
      { question: 'How accurate are the summaries?', answer: 'Our AI captures key points and main ideas effectively. Always review summaries for critical use cases.' },
      { question: 'Can I control summary length?', answer: 'Specify in your prompt if you want a "brief summary" or "detailed summary" to control output length.' }
    ]
  };
}
