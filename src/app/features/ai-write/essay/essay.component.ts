import { Component } from '@angular/core';
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
    seoTitle: 'Free AI Essay Writer - Generate Essays on Any Topic',
    seoIntro: 'Create well-researched, structured essays instantly using AI. Perfect for students, researchers, and writers who need quality content on any subject.',
    features: [
      { icon: 'fa-solid fa-list-ol', title: 'Structured Format', description: 'Proper introduction, body paragraphs, and conclusion.' },
      { icon: 'fa-solid fa-sliders', title: 'Adjustable Length', description: 'Choose 1-10 paragraphs based on your needs.' },
      { icon: 'fa-solid fa-book-open', title: 'Any Subject', description: 'History, science, literature, business, and more.' },
      { icon: 'fa-solid fa-spell-check', title: 'Grammar Perfect', description: 'Professionally written with proper grammar.' },
      { icon: 'fa-solid fa-brain', title: 'Thoughtful Arguments', description: 'Well-reasoned points and supporting evidence.' },
      { icon: 'fa-solid fa-clock', title: 'Time Saver', description: 'Complete essays in seconds, not hours.' }
    ],
    useCases: [
      'Students needing essay drafts for assignments',
      'Researchers exploring new topics quickly',
      'Content writers creating long-form articles',
      'Professionals preparing position papers'
    ],
    faqs: [
      { question: 'How do I control essay length?', answer: 'Use the paragraph selector to choose between 1-10 paragraphs. Each paragraph is typically 100-150 words.' },
      { question: 'Can I use this for academic papers?', answer: 'The AI provides a great starting point, but we recommend reviewing, editing, and adding citations before submitting for academic purposes.' },
      { question: 'What essay types can it write?', answer: 'Argumentative, expository, descriptive, narrative, compare/contrast, and more. Just specify the type in your prompt.' },
      { question: 'How do I get better results?', answer: 'Be specific about your topic, the type of essay, and any key arguments you want included. Include your thesis statement if you have one.' }
    ]
  };
}
