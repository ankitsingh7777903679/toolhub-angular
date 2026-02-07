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
  selector: 'app-pdf-tools',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-white">
        <!-- Header -->
        <div class="bg-gradient-to-r from-purple-600 to-purple-700 py-16">
            <div class="container mx-auto px-4 text-center">
                <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i class="fa-solid fa-file-pdf text-3xl text-white"></i>
                </div>
                <h1 class="text-4xl font-bold text-white mb-3">PDF Tools</h1>
                <p class="text-purple-200 text-lg mb-8">Powerful tools to work with PDF files</p>
                
                <!-- Search Bar -->
                <div class="w-full max-w-xl mx-auto px-4 md:px-0">
                    <div class="bg-white rounded-full p-2 flex items-center shadow-lg">
                        <i class="fa-solid fa-magnifying-glass text-gray-400 ml-2 mr-2"></i>
                        <input 
                            type="text" 
                            [(ngModel)]="searchQuery" 
                            (input)="filterTools()"
                            placeholder="Search for a PDF tool..." 
                            class="flex-1 outline-none text-gray-700 placeholder-gray-400 min-w-0 py-1">
                        <button class="bg-purple-500 text-white px-5 py-2 rounded-full font-bold hover:bg-purple-600 transition-colors text-sm flex-shrink-0">
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
                    class="group block bg-white rounded-2xl p-6 border border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col justify-between">
                    <div class="flex justify-between items-start mb-6">
                        <div 
                            class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                            [style.backgroundColor]="tool.bgColor">
                            <i [class]="tool.icon + ' text-2xl'" [style.color]="tool.iconColor"></i>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                            <i class="fa-solid fa-arrow-right text-gray-400 group-hover:text-purple-600 text-sm transition-colors"></i>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900 text-lg mb-2 group-hover:text-purple-600 transition-colors">{{ tool.name }}</h3>
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
export class PdfToolsComponent {
  searchQuery = '';

  tools: Tool[] = [
    {
      name: 'Merge PDF',
      description: 'Combine multiple PDF files into one document',
      icon: 'fa-solid fa-object-group',
      iconColor: '#F97316',
      bgColor: '#FFEDD5',
      link: 'merge'
    },
    {
      name: 'Split PDF',
      description: 'Split PDF into multiple files by selecting pages',
      icon: 'fa-solid fa-scissors',
      iconColor: '#7C3AED',
      bgColor: '#EDE9FE',
      link: 'split'
    },
    {
      name: 'Image to PDF',
      description: 'Convert images to PDF document',
      icon: 'fa-solid fa-file-image',
      iconColor: '#EC4899',
      bgColor: '#FCE7F3',
      link: 'img-to-pdf'
    },
    {
      name: 'HTML to PDF',
      description: 'Convert web pages or HTML to PDF documents',
      icon: 'fa-solid fa-code',
      iconColor: '#14B8A6',
      bgColor: '#CCFBF1',
      link: 'html-to-pdf'
    },
    {
      name: 'Compress PDF',
      description: 'Reduce PDF file size while maintaining quality',
      icon: 'fa-solid fa-compress',
      iconColor: '#10B981',
      bgColor: '#D1FAE5',
      link: 'compress'
    },
    {
      name: 'PDF to Image',
      description: 'Convert PDF pages to JPG or PNG images',
      icon: 'fa-solid fa-image',
      iconColor: '#3B82F6',
      bgColor: '#DBEAFE',
      link: 'to-image'
    },
    {
      name: 'Rotate PDF',
      description: 'Rotate PDF pages to any angle',
      icon: 'fa-solid fa-rotate',
      iconColor: '#8B5CF6',
      bgColor: '#EDE9FE',
      link: 'rotate'
    },
    {
      name: 'Add Watermark',
      description: 'Add text or image watermark to PDF',
      icon: 'fa-solid fa-droplet',
      iconColor: '#0EA5E9',
      bgColor: '#E0F2FE',
      link: 'watermark'
    },
    {
      name: 'Unlock PDF',
      description: 'Remove password protection from PDF',
      icon: 'fa-solid fa-lock-open',
      iconColor: '#EF4444',
      bgColor: '#FEE2E2',
      link: 'unlock'
    },
    {
      name: 'Protect PDF',
      description: 'Add password protection to PDF file',
      icon: 'fa-solid fa-lock',
      iconColor: '#22C55E',
      bgColor: '#DCFCE7',
      link: 'protect'
    },
    {
      name: 'PDF OCR',
      description: 'Extract text from scanned PDF using OCR',
      icon: 'fa-solid fa-eye',
      iconColor: '#2563EB',
      bgColor: '#DBEAFE',
      link: 'ocr'
    },

    {
      name: 'Word to PDF',
      description: 'Convert Word documents to PDF format',
      icon: 'fa-solid fa-file-pdf',
      iconColor: '#DC2626',
      bgColor: '#FEE2E2',
      link: 'word-to-pdf'
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
