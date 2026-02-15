import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Tool {
  name: string;
  description: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  link: string;
}

@Component({
  selector: 'app-ai-write',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-white dark:bg-slate-900">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
            <div class="container mx-auto px-4 text-center">
                <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i class="fa-solid fa-pen-nib text-3xl text-white"></i>
                </div>
                <h1 class="text-4xl font-bold text-white mb-3">AI Writing Tools</h1>
                <p class="text-blue-100 text-lg mb-8">Powered by Google Gemini AI - Write anything with AI assistance</p>
                
                <!-- Search Bar -->
                <div class="w-full max-w-xl mx-auto px-4 md:px-0">
                    <div class="bg-white dark:bg-slate-800 rounded-full p-2 flex items-center shadow-lg">
                        <i class="fa-solid fa-magnifying-glass text-gray-400 ml-2 mr-2"></i>
                        <input 
                            type="text" 
                            [(ngModel)]="searchQuery" 
                            (input)="filterTools()"
                            placeholder="Search for a writing tool..." 
                            class="flex-1 outline-none text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 min-w-0 py-1 bg-transparent">
                        <button class="bg-blue-500 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-600 transition-colors text-sm flex-shrink-0">
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tools Grid -->
        <div class="container mx-auto px-4 py-12">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                @for (tool of filteredTools; track tool.name) {
                <a 
                    [routerLink]="tool.link"
                    class="group block bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col justify-between">
                    <div class="flex justify-between items-start mb-6">
                        <div 
                            class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                            [style.backgroundColor]="tool.bgColor">
                            <i [class]="tool.icon + ' text-2xl'" [style.color]="tool.iconColor"></i>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                            <i class="fa-solid fa-arrow-right text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm"></i>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{{ tool.name }}</h3>
                        <p class="text-gray-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">{{ tool.description }}</p>
                    </div>
                </a>
                }
                
                @if (filteredTools.length === 0) {
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-500">No tools found matching "{{ searchQuery }}"</p>
                </div>
                }
            </div>
        </div>

        <!-- SEO Content -->
        <article class="prose lg:prose-xl mx-auto mt-16 px-4 max-w-4xl pb-16">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">AI Writing Tools That Actually Save You Time</h2>
            <p class="text-gray-600 dark:text-slate-400 mb-8 leading-relaxed">
                Let's be honest — staring at a blank page is the worst part of writing. Whether it's a cold email you've rewritten in your head six times, a blog post you keep putting off, or an essay due tomorrow morning, the hardest step is always getting something on the page. That's where these tools come in. They're powered by Google Gemini and they give you a solid first draft in seconds — not perfect prose, but a real starting point you can shape into something good.
            </p>

            <h2 class="text-2xl font-bold text-gray-800 dark:text-slate-200 mb-4">What Can You Actually Do Here?</h2>
            <p class="text-gray-600 dark:text-slate-400 mb-8 leading-relaxed">
                More than you'd expect. Need a professional cold email for a sales pitch? There's a tool for that. Writing a 5-paragraph essay on climate change? Covered. Want to turn a 3,000-word article into a quick summary? Done in about ten seconds. You can also rewrite existing content to make it unique, fix grammar mistakes, change the tone of a message from casual to formal, generate product descriptions for your online store, create social media posts, or even write short stories. Each tool is tuned for its specific job — the blog writer structures content with headings, the email generator keeps things concise, and the story generator actually builds a narrative arc.
            </p>

            <h2 class="text-2xl font-bold text-gray-800 dark:text-slate-200 mb-4">How Does the AI Part Work?</h2>
            <p class="text-gray-600 dark:text-slate-400 mb-8 leading-relaxed">
                You type a prompt describing what you want — the more specific, the better — and the AI generates original content from scratch. It's not copying from a database or stitching together existing articles. Each output is created fresh based on your exact input. If you write "blog post about healthy meal prep for busy parents with three recipe ideas," that's exactly what you'll get. The output isn't always publish-ready (what first draft is?), but it gives you 80% of the work done so you can focus on the editing and personal touches that make content yours.
            </p>
        </article>
    </div>
    `
})
export class AiWriteComponent {
  searchQuery = '';

  tools: Tool[] = [
    {
      name: 'Cold Email Generator',
      description: 'Generate professional cold emails for outreach',
      icon: 'fa-solid fa-envelope',
      iconColor: '#EC4899',
      bgColor: '#FCE7F3',
      link: 'cold-email'
    },
    {
      name: 'Essay Writer',
      description: 'Write well-structured essays on any topic',
      icon: 'fa-solid fa-pen-nib',
      iconColor: '#6366F1',
      bgColor: '#E0E7FF',
      link: 'essay'
    },
    {
      name: 'Blog Post Generator',
      description: 'Create engaging blog posts with AI',
      icon: 'fa-solid fa-blog',
      iconColor: '#14B8A6',
      bgColor: '#CCFBF1',
      link: 'blog'
    },
    {
      name: 'Content Summarizer',
      description: 'Summarize long articles and documents',
      icon: 'fa-solid fa-compress',
      iconColor: '#8B5CF6',
      bgColor: '#EDE9FE',
      link: 'summarizer'
    },
    {
      name: 'Paragraph Writer',
      description: 'Generate paragraphs on any topic',
      icon: 'fa-solid fa-paragraph',
      iconColor: '#3B82F6',
      bgColor: '#DBEAFE',
      link: 'paragraph'
    },
    {
      name: 'Article Rewriter',
      description: 'Rewrite articles to make them unique',
      icon: 'fa-solid fa-rotate',
      iconColor: '#F97316',
      bgColor: '#FFEDD5',
      link: 'rewriter'
    },
    {
      name: 'Grammar Checker',
      description: 'Check and fix grammar mistakes',
      icon: 'fa-solid fa-spell-check',
      iconColor: '#22C55E',
      bgColor: '#DCFCE7',
      link: 'grammar'
    },
    {
      name: 'Tone Changer',
      description: 'Change the tone of your writing',
      icon: 'fa-solid fa-sliders',
      iconColor: '#EF4444',
      bgColor: '#FEE2E2',
      link: 'tone'
    },
    {
      name: 'Product Description',
      description: 'Write compelling product descriptions',
      icon: 'fa-solid fa-box',
      iconColor: '#0EA5E9',
      bgColor: '#E0F2FE',
      link: 'product'
    },
    {
      name: 'Social Media Post',
      description: 'Generate engaging social media content',
      icon: 'fa-solid fa-hashtag',
      iconColor: '#7C3AED',
      bgColor: '#EDE9FE',
      link: 'social'
    },
    {
      name: 'Story Generator',
      description: 'Create creative stories with AI',
      icon: 'fa-solid fa-book',
      iconColor: '#D946EF',
      bgColor: '#FAE8FF',
      link: 'story'
    },
    {
      name: 'JSON to XML',
      description: 'Convert JSON data to XML format',
      icon: 'fa-solid fa-code',
      iconColor: '#64748B',
      bgColor: '#F1F5F9',
      link: 'json-to-xml'
    }
  ];

  filteredTools = this.tools;

  filterTools() {
    if (!this.searchQuery.trim()) {
      this.filteredTools = this.tools;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredTools = this.tools.filter(tool =>
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query)
    );
  }
}
