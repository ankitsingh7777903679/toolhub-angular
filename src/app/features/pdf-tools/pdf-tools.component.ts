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
    <div class="min-h-screen bg-white dark:bg-slate-900">
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
                    <div class="bg-white dark:bg-slate-800 rounded-full p-2 flex items-center shadow-lg">
                        <i class="fa-solid fa-magnifying-glass text-gray-400 ml-2 mr-2"></i>
                        <input 
                            type="text" 
                            [(ngModel)]="searchQuery" 
                            (input)="filterTools()"
                            placeholder="Search for a PDF tool..." 
                            class="flex-1 outline-none text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 min-w-0 py-1 bg-transparent">
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
                    class="group block bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-500/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col justify-between">
                    <div class="flex justify-between items-start mb-6">
                        <div 
                            class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                            [style.backgroundColor]="tool.bgColor">
                            <i [class]="tool.icon + ' text-2xl'" [style.color]="tool.iconColor"></i>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-purple-50 dark:group-hover:bg-purple-900/30 transition-colors">
                            <i class="fa-solid fa-arrow-right text-gray-400 dark:text-slate-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 text-sm transition-colors"></i>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{{ tool.name }}</h3>
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
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Free Online PDF Tools — Edit, Convert, and Manage PDFs</h2>
            <p class="text-gray-600 dark:text-slate-400 mb-8 leading-relaxed">
                2olhub offers a comprehensive suite of free online PDF tools that let you work with PDF files without installing any software. Whether you need to combine multiple documents into a single file, split a large PDF into individual pages, compress oversized reports for email, or convert between PDF and other formats, our tools handle it all directly in your browser.
            </p>

            <h2 class="text-2xl font-bold text-gray-800 dark:text-slate-200 mb-4">All-in-One PDF Solution</h2>
            <p class="text-gray-600 dark:text-slate-400 mb-8 leading-relaxed">
                Our PDF toolkit covers every common document task. Merge contracts and proposals into a single professional document. Split lengthy reports into separate chapters. Add watermarks to protect your intellectual property, or password-protect sensitive files with strong encryption. You can even rotate scanned pages, convert Word documents to PDF, or extract text from scanned PDFs using our AI-powered OCR technology. Each tool is designed to do one job exceptionally well — fast, free, and without limitations.
            </p>

            <h2 class="text-2xl font-bold text-gray-800 dark:text-slate-200 mb-4">No Software Installation Needed</h2>
            <p class="text-gray-600 dark:text-slate-400 mb-8 leading-relaxed">
                All our PDF tools run entirely in your web browser. There is nothing to download or install, and your files are processed locally on your device for maximum privacy. Whether you are on Windows, Mac, Linux, or a mobile device, our tools work seamlessly on any platform. No registration or account is required — just upload your file, process it, and download the result.
            </p>
        </article>
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
