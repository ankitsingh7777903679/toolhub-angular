import { Component } from '@angular/core';
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
  config = {
    promptType: 'summarizing',
    title: 'AI Content Summarizer',
    subtitle: 'Summarize long articles and documents into concise text',
    placeholder: 'Paste the content you want to summarize here...',
    showParagraphs: false,
    iconClass: 'fa-solid fa-compress',
    iconColor: '#8B5CF6',
    bgColor: '#F5F3FF'
  };
}
