import { Component, inject } from '@angular/core';
import { SeoService } from '../../../core/services/seo.service';
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
  private seoService = inject(SeoService);

  constructor() {
    this.seoService.updateSeo({
      title: 'Free AI Blog Post Generator - Write SEO Articles in Minutes',
      description: 'Generate high-quality, SEO-optimized blog posts and articles with our free AI blog writer. Scale your content marketing and rank higher on search engines.',
      keywords: 'ai blog post generator, ai article writer, seo content generator, ai content creation tool, blog structure generator, automated blog writing, free content writer, seo article generator',
      url: 'https://2olhub.netlify.app/write/blog'
    });
    this.seoService.setFaqJsonLd([
      { question: 'How long are the posts it generates?', answer: 'Usually around 800-1,200 words with an intro, 3-5 sections with subheadings, and a conclusion. If you need it shorter or longer, mention that in your prompt.' },
      { question: 'Can I just publish the output directly?', answer: 'You could, but we wouldn\'t recommend it. The AI gives you a strong first draft — add your own examples, tweak the tone, and fact-check any claims before hitting publish.' },
      { question: 'Will Google penalize AI-generated content?', answer: 'Google has said they care about quality, not whether a human or AI wrote it. That said, adding personal experience and unique insights always helps your content stand out.' },
      { question: 'What makes a good prompt for blog posts?', answer: 'Be specific. Instead of "write about fitness," try "write a blog post about strength training for beginners over 40, with 5 exercises they can do at home." The more detail, the better the output.' }
    ]);
  }

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
    seoTitle: 'AI Blog Post Generator — Skip the Blank Page',
    seoIntro: 'Coming up with blog post ideas is easy. Actually sitting down and writing 1,000 words with headings, structure, and flow? That\'s the hard part. This tool gives you a complete first draft — intro, sections, conclusion — so you can focus on polishing instead of starting from zero.',
    features: [
      { icon: 'fa-solid fa-magnifying-glass', title: 'Built for Search', description: 'Posts come with proper headings and keyword-friendly structure.' },
      { icon: 'fa-solid fa-bolt', title: 'Done in Seconds', description: 'A full blog post in under 30 seconds — not hours.' },
      { icon: 'fa-solid fa-language', title: 'Reads Like a Human Wrote It', description: 'Natural sentences, not robotic paragraph after paragraph.' },
      { icon: 'fa-solid fa-copy', title: 'Copy and Paste', description: 'One click to copy into WordPress, Ghost, or wherever you publish.' },
      { icon: 'fa-solid fa-pen-fancy', title: 'Works for Any Niche', description: 'Tech, health, finance, travel, cooking — just describe your topic.' },
      { icon: 'fa-solid fa-infinity', title: 'No Limits', description: 'Generate as many posts as you want, no daily caps.' }
    ],
    useCases: [
      'Content marketers who need to publish regularly but don\'t have time to write everything from scratch',
      'Small business owners who want blog content on their website but can\'t afford a writer',
      'Affiliate marketers creating product comparisons and reviews at scale',
      'Students researching topics and needing a starting framework'
    ],
    faqs: [
      { question: 'How long are the posts it generates?', answer: 'Usually around 800-1,200 words with an intro, 3-5 sections with subheadings, and a conclusion. If you need it shorter or longer, mention that in your prompt.' },
      { question: 'Can I just publish the output directly?', answer: 'You could, but we wouldn\'t recommend it. The AI gives you a strong first draft — add your own examples, tweak the tone, and fact-check any claims before hitting publish.' },
      { question: 'Will Google penalize AI-generated content?', answer: 'Google has said they care about quality, not whether a human or AI wrote it. That said, adding personal experience and unique insights always helps your content stand out.' },
      { question: 'What makes a good prompt for blog posts?', answer: 'Be specific. Instead of "write about fitness," try "write a blog post about strength training for beginners over 40, with 5 exercises they can do at home." The more detail, the better the output.' }
    ]
  };
}
