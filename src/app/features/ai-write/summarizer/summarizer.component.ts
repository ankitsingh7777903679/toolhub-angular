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
    this.seoService.setFaqJsonLd([
      { question: 'How much text can I paste in?', answer: 'Several thousand words at a time. If you have a very long document — like a 30-page PDF — break it into sections and summarize each one separately for the best results.' },
      { question: 'What kind of content works best?', answer: 'Pretty much anything text-based — journal articles, blog posts, news stories, business reports, email threads, meeting transcripts, legal documents. If it has words, the summarizer can handle it.' },
      { question: 'How accurate are the summaries?', answer: 'The AI does a solid job capturing main ideas and key arguments. For anything critical — medical, legal, financial — always double-check the summary against the original.' },
      { question: 'Can I get different summary lengths?', answer: 'Yes. Add "give me a 2-sentence summary" or "write a detailed summary with all main points" to your prompt. The AI adjusts accordingly.' }
    ]);
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
    seoTitle: 'AI Text Summarizer — Long Article? Get the Key Points Fast',
    seoIntro: 'You don\'t always have time to read a 20-page report or a 5,000-word article. Paste it here, and you\'ll get the important parts distilled into a few paragraphs. Works for research papers, news articles, meeting notes, or anything else that\'s too long to skim.',
    features: [
      { icon: 'fa-solid fa-compress', title: 'Cuts the Fluff', description: 'Pulls out what matters and drops the filler.' },
      { icon: 'fa-solid fa-file-lines', title: 'Handles Long Texts', description: 'Paste articles, reports, even full chapters.' },
      { icon: 'fa-solid fa-bullseye', title: 'Finds the Core Ideas', description: 'The AI identifies main arguments and key takeaways.' },
      { icon: 'fa-solid fa-bolt', title: 'Takes Seconds', description: 'A 3,000-word article summarized in about 10 seconds.' },
      { icon: 'fa-solid fa-graduation-cap', title: 'Great for Studying', description: 'Turn textbook chapters into study notes.' },
      { icon: 'fa-solid fa-briefcase', title: 'Works for Business Too', description: 'Summarize reports, emails, proposals, and memos.' }
    ],
    useCases: [
      'Students reviewing research papers before deciding which ones to read fully',
      'Professionals who get 50-page reports and need the executive summary version',
      'Researchers scanning multiple articles to find relevant ones for their work',
      'Content curators pulling key points from articles for newsletters or roundups'
    ],
    faqs: [
      { question: 'How much text can I paste in?', answer: 'Several thousand words at a time. If you have a very long document — like a 30-page PDF — break it into sections and summarize each one separately for the best results.' },
      { question: 'What kind of content works best?', answer: 'Pretty much anything text-based — journal articles, blog posts, news stories, business reports, email threads, meeting transcripts, legal documents. If it has words, the summarizer can handle it.' },
      { question: 'How accurate are the summaries?', answer: 'The AI does a solid job capturing main ideas and key arguments. For anything critical — medical, legal, financial — always double-check the summary against the original.' },
      { question: 'Can I get different summary lengths?', answer: 'Yes. Add "give me a 2-sentence summary" or "write a detailed summary with all main points" to your prompt. The AI adjusts accordingly.' }
    ]
  };
}
