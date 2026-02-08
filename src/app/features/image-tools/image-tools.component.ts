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
  isWorking?: boolean;
}

@Component({
  selector: 'app-image-tools',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="min-h-screen bg-white">
        <!-- Header -->
        <div class="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
            <div class="container mx-auto px-4 text-center">
                <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i class="fa-solid fa-image text-3xl text-white"></i>
                </div>
                <h1 class="text-4xl font-bold text-white mb-3">Image Tools</h1>
                <p class="text-orange-100 text-lg mb-8">Powerful tools to edit and transform your images</p>
                
                <!-- Search Bar -->
                <div class="w-full max-w-xl mx-auto px-4 md:px-0">
                    <div class="bg-white rounded-full p-2 flex items-center shadow-lg">
                        <i class="fa-solid fa-magnifying-glass text-gray-400 ml-2 mr-2"></i>
                        <input 
                            type="text" 
                            [(ngModel)]="searchQuery" 
                            (input)="filterTools()"
                            placeholder="Search for an image tool..." 
                            class="flex-1 outline-none text-gray-700 placeholder-gray-400 min-w-0 py-1">
                        <button class="bg-orange-500 text-white px-5 py-2 rounded-full font-bold hover:bg-orange-600 transition-colors text-sm flex-shrink-0">
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
                    class="group block bg-white rounded-2xl p-6 border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col justify-between">
                    <div class="flex justify-between items-start mb-6">
                        <div 
                            class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                            [style.backgroundColor]="tool.bgColor">
                            <i [class]="tool.icon + ' text-2xl'" [style.color]="tool.iconColor"></i>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-orange-50 transition-colors">
                            <i class="fa-solid fa-arrow-right text-gray-400 group-hover:text-orange-600 text-sm transition-colors"></i>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900 text-lg mb-2 group-hover:text-orange-600 transition-colors">{{ tool.name }}</h3>
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
export class ImageToolsComponent {
  searchQuery = '';

  tools: Tool[] = [
    {
      name: 'AI Image Generator',
      description: 'Generate stunning images using AI from text prompts',
      icon: 'fa-solid fa-wand-magic-sparkles',
      iconColor: '#10B981',
      bgColor: '#D1FAE5',
      link: 'ai-generator',
      isWorking: true
    },
    {
      name: 'Image Compressor',
      description: 'Compress images without losing quality',
      icon: 'fa-solid fa-compress',
      iconColor: '#3B82F6',
      bgColor: '#DBEAFE',
      link: 'compress',
      isWorking: true
    },
    {
      name: 'AI Image Enhancer',
      description: 'Enhance and upscale blurry images with AI',
      icon: 'fa-solid fa-wand-magic-sparkles',
      iconColor: '#8B5CF6',
      bgColor: '#EDE9FE',
      link: 'enhance',
      isWorking: true
    },
    {
      name: 'WebP to JPG',
      description: 'Convert WebP images to JPG format',
      icon: 'fa-solid fa-file-image',
      iconColor: '#0EA5E9',
      bgColor: '#E0F2FE',
      link: 'webp-to-jpg',
      isWorking: true
    },
    {
      name: 'PNG to WebP',
      description: 'Convert PNG images to WebP format',
      icon: 'fa-solid fa-file-image',
      iconColor: '#2563EB',
      bgColor: '#DBEAFE',
      link: 'png-to-webp',
      isWorking: true
    },
    {
      name: 'PNG to JPG',
      description: 'Convert PNG images to JPG format',
      icon: 'fa-solid fa-image',
      iconColor: '#14B8A6',
      bgColor: '#CCFBF1',
      link: 'png-to-jpg',
      isWorking: true
    },
    {
      name: 'JPG to PNG',
      description: 'Convert JPG images to PNG format',
      icon: 'fa-solid fa-images',
      iconColor: '#7C3AED',
      bgColor: '#EDE9FE',
      link: 'jpg-to-png',
      isWorking: true
    },
    {
      name: 'Image to Base64',
      description: 'Convert images to Base64 encoded string',
      icon: 'fa-solid fa-code',
      iconColor: '#6366F1',
      bgColor: '#E0E7FF',
      link: 'to-base64',
      isWorking: true
    },
    {
      name: 'Remove Background',
      description: 'Automatically remove background from any image',
      icon: 'fa-solid fa-eraser',
      iconColor: '#06B6D4',
      bgColor: '#CFFAFE',
      link: 'remove-bg',
      isWorking: true
    },
    {
      name: 'Resize Image',
      description: 'Resize images to any dimension',
      icon: 'fa-solid fa-expand',
      iconColor: '#8B5CF6',
      bgColor: '#EDE9FE',
      link: 'resize',
      isWorking: true
    },
    {
      name: 'Crop Image',
      description: 'Crop images to remove unwanted parts',
      icon: 'fa-solid fa-crop',
      iconColor: '#F97316',
      bgColor: '#FFEDD5',
      link: 'crop',
      isWorking: true
    },
    {
      name: 'Add Watermark',
      description: 'Add text or image watermark to pictures',
      icon: 'fa-solid fa-droplet',
      iconColor: '#06B6D4',
      bgColor: '#CFFAFE',
      link: 'watermark',
      isWorking: true
    },
    {
      name: 'Rotate Image',
      description: 'Rotate images to any angle',
      icon: 'fa-solid fa-rotate',
      iconColor: '#22C55E',
      bgColor: '#DCFCE7',
      link: 'rotate'
    },
    {
      name: 'Blur Image',
      description: 'Add blur effect to your images',
      icon: 'fa-solid fa-eye-low-vision',
      iconColor: '#8B5CF6',
      bgColor: '#EDE9FE',
      link: 'blur',
      isWorking: true
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

