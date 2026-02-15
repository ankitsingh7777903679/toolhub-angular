import { Component, inject } from '@angular/core';
import { SeoService } from '../../../core/services/seo.service';
import { AiWriterComponent } from '../shared/ai-writer/ai-writer.component';

@Component({
  selector: 'app-essay',
  standalone: true,
  imports: [AiWriterComponent],
  template: `
        <app-ai-writer [config]="config"></app-ai-writer>
    `
})
export class EssayComponent {
  private seoService = inject(SeoService);

  constructor() {
    this.seoService.updateSeo({
      title: 'Free AI Essay Writer - Generate High-Quality Essays Instantly',
      description: 'Write well-structured essays, research papers, and assignments with our free AI essay generator. Perfect for students and professionals looking to overcome writer\'s block.',
      keywords: 'ai essay writer, free ai essay generator, essay writing ai, ai academic writing, ai paper writer, plagiarism-free essay, essay outline generator, automated essay writer',
      url: 'https://2olhub.netlify.app/write/essay'
    });
    this.seoService.setFaqJsonLd([
      { question: 'How do I control how long the essay is?', answer: 'Use the paragraph selector — pick between 1 and 10 paragraphs. Each one is usually around 100-150 words, so a 5-paragraph essay comes out to roughly 600-750 words.' },
      { question: 'Can I use this for school assignments?', answer: 'It\'s a great starting point, but treat it as a first draft. You\'ll want to add your own analysis, verify facts, include proper citations, and put it in your own voice before submitting.' },
      { question: 'What types of essays can it write?', answer: 'Argumentative, expository, descriptive, narrative, compare-and-contrast, persuasive — just tell it what type you need in your prompt.' },
      { question: 'My essays keep coming out generic. How do I fix that?', answer: 'The trick is being specific in your prompt. Don\'t just say "write about climate change." Say "write an argumentative essay about why carbon taxes are more effective than cap-and-trade systems, with examples from Europe." The AI mirrors the specificity you give it.' }
    ]);
  }

  config = {
    promptType: 'essay',
    title: 'AI Essay Writer',
    subtitle: 'Generate well-structured essays on any topic',
    placeholder: 'Enter your essay topic... e.g., "Write an essay about the impact of artificial intelligence on modern education"',
    showParagraphs: true,
    iconClass: 'fa-solid fa-pen-nib',
    iconColor: '#6366F1',
    bgColor: '#E0E7FF',
    // SEO Content
    seoTitle: 'AI Essay Writer — Get Past Writer\'s Block in Seconds',
    seoIntro: 'You know the assignment. You know the topic. You just can\'t get the words out. This tool generates a structured essay — introduction, body paragraphs, conclusion — so you have something real to work with instead of a blinking cursor.',
    features: [
      { icon: 'fa-solid fa-list-ol', title: 'Proper Structure', description: 'Intro with thesis, organized body paragraphs, and a conclusion that wraps it up.' },
      { icon: 'fa-solid fa-sliders', title: 'You Pick the Length', description: 'Choose anywhere from 1 to 10 paragraphs depending on what you need.' },
      { icon: 'fa-solid fa-book-open', title: 'Any Subject', description: 'History, biology, philosophy, economics, literature — it handles all of them.' },
      { icon: 'fa-solid fa-spell-check', title: 'Clean Writing', description: 'Grammatically solid output without the typos.' },
      { icon: 'fa-solid fa-brain', title: 'Actual Arguments', description: 'Not just filler text — it builds logical points with supporting details.' },
      { icon: 'fa-solid fa-clock', title: 'Minutes, Not Hours', description: 'A 5-paragraph essay in about 15 seconds.' }
    ],
    useCases: [
      'Students who need a draft to build on when the deadline is close',
      'Researchers exploring a new topic and wanting a quick overview',
      'Writers needing a framework they can fill in with their own research',
      'Professionals preparing position papers or white papers as a starting point'
    ],
    faqs: [
      { question: 'How do I control how long the essay is?', answer: 'Use the paragraph selector — pick between 1 and 10 paragraphs. Each one is usually around 100-150 words, so a 5-paragraph essay comes out to roughly 600-750 words.' },
      { question: 'Can I use this for school assignments?', answer: 'It\'s a great starting point, but treat it as a first draft. You\'ll want to add your own analysis, verify facts, include proper citations, and put it in your own voice before submitting.' },
      { question: 'What types of essays can it write?', answer: 'Argumentative, expository, descriptive, narrative, compare-and-contrast, persuasive — just tell it what type you need in your prompt.' },
      { question: 'My essays keep coming out generic. How do I fix that?', answer: 'The trick is being specific in your prompt. Don\'t just say "write about climate change." Say "write an argumentative essay about why carbon taxes are more effective than cap-and-trade systems, with examples from Europe." The AI mirrors the specificity you give it.' }
    ]
  };
}
