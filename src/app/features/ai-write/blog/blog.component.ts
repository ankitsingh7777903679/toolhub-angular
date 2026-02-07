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
    bgColor: '#F0FDFA',
    // SEO Content
    seoTitle: 'Free AI Blog Post Generator - Create SEO-Optimized Articles',
    seoIntro: 'Generate high-quality, engaging blog posts in seconds using Google Gemini AI. Perfect for content marketers, bloggers, and businesses looking to scale their content creation.',
    features: [
      { icon: 'fa-solid fa-magnifying-glass', title: 'SEO Optimized', description: 'Content structured for search engines with proper headings and keywords.' },
      { icon: 'fa-solid fa-bolt', title: 'Instant Generation', description: 'Get complete blog posts in under 30 seconds.' },
      { icon: 'fa-solid fa-language', title: 'Natural Language', description: 'Human-like writing that engages readers.' },
      { icon: 'fa-solid fa-copy', title: 'One-Click Copy', description: 'Easily copy content to your CMS or editor.' },
      { icon: 'fa-solid fa-pen-fancy', title: 'Any Topic', description: 'Generate posts on any subject or niche.' },
      { icon: 'fa-solid fa-infinity', title: 'Unlimited Use', description: 'No limits on how many posts you can generate.' }
    ],
    useCases: [
      'Content marketers scaling blog production',
      'Small business owners needing website content',
      'Affiliate marketers creating product reviews',
      'Students researching topics for projects'
    ],
    faqs: [
      { question: 'How long are the generated blog posts?', answer: 'Generated posts typically include an introduction, 3-5 main sections with subheadings, and a conclusion - around 800-1200 words depending on your topic.' },
      { question: 'Can I edit the generated content?', answer: 'Yes! Copy the content and edit it in any text editor or CMS. We recommend reviewing and adding your personal touch before publishing.' },
      { question: 'Is the content unique?', answer: 'Each generation creates fresh content based on your specific prompt. However, we recommend running it through a plagiarism checker before publishing.' },
      { question: 'What makes a good prompt?', answer: 'Be specific about your topic, target audience, and any key points you want covered. For example: "Write a blog post about healthy meal prep for busy professionals, including 5 easy recipes."' }
    ]
  };
}
