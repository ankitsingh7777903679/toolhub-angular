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
    <div class="min-h-screen bg-white">
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
                    <div class="bg-white rounded-full p-2 flex items-center shadow-lg">
                        <i class="fa-solid fa-magnifying-glass text-gray-400 ml-2 mr-2"></i>
                        <input 
                            type="text" 
                            [(ngModel)]="searchQuery" 
                            (input)="filterTools()"
                            placeholder="Search for a writing tool..." 
                            class="flex-1 outline-none text-gray-700 placeholder-gray-400 min-w-0 py-1">
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
                    class="group block bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col justify-between">
                    <div class="flex justify-between items-start mb-6">
                        <div 
                            class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                            [style.backgroundColor]="tool.bgColor">
                            <i [class]="tool.icon + ' text-2xl'" [style.color]="tool.iconColor"></i>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                            <i class="fa-solid fa-arrow-right text-gray-400 group-hover:text-blue-600 text-sm"></i>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">{{ tool.name }}</h3>
                        <p class="text-gray-500 text-sm leading-relaxed line-clamp-2">{{ tool.description }}</p>
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
