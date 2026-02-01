import { Component } from '@angular/core';
import { AiWriterComponent } from '../shared/ai-writer/ai-writer.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [AiWriterComponent],
  template: `
        <app-ai-writer [config]="config"></app-ai-writer>
    `
})
export class BlogComponent {
  config = {
    promptType: 'blogPost',
    title: 'AI Blog Post Generator',
    subtitle: 'Let AI generate SEO optimized blog posts for your website',
    placeholder: 'Enter your blog topic... e.g., "Write a blog post about the benefits of remote work for software developers"',
    showParagraphs: false,
    iconClass: 'fa-solid fa-blog',
    iconColor: '#14B8A6',
    bgColor: '#F0FDFA'
  };
}
