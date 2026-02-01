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
    promptType: 'assay',
    title: 'AI Essay Generator',
    subtitle: 'Write well-structured essays on any topic with AI assistance',
    placeholder: 'Enter your essay topic... e.g., "Write an essay about the impact of artificial intelligence on modern education"',
    showParagraphs: true,
    iconClass: 'fa-solid fa-pen-nib',
    iconColor: '#6366F1',
    bgColor: '#EEF2FF'
  };
}
