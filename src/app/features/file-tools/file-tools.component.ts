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
    isAI?: boolean;
}

@Component({
    selector: 'app-file-tools',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    template: `
    <div class="min-h-screen bg-white">
        <!-- Header -->
        <div class="bg-gradient-to-r from-emerald-500 to-teal-600 py-16">
            <div class="container mx-auto px-4 text-center">
                <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i class="fa-solid fa-folder-open text-3xl text-white"></i>
                </div>
                <h1 class="text-4xl font-bold text-white mb-3">File Tools</h1>
                <p class="text-emerald-100 text-lg mb-8">Convert and transform your files easily</p>
                
                <!-- Search Bar -->
                <div class="w-full max-w-xl mx-auto px-4 md:px-0">
                    <div class="bg-white rounded-full p-2 flex items-center shadow-lg">
                        <i class="fa-solid fa-magnifying-glass text-gray-400 ml-2 mr-2"></i>
                        <input 
                            type="text" 
                            [(ngModel)]="searchQuery" 
                            (input)="filterTools()"
                            placeholder="Search for a file tool..." 
                            class="flex-1 outline-none text-gray-700 placeholder-gray-400 min-w-0 py-1">
                        <button class="bg-emerald-500 text-white px-5 py-2 rounded-full font-bold hover:bg-emerald-600 transition-colors text-sm flex-shrink-0">
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
                    class="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div class="flex justify-between items-start mb-6">
                        <div 
                            class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                            [style.backgroundColor]="tool.bgColor">
                            <i [class]="tool.icon + ' text-2xl'" [style.color]="tool.iconColor"></i>
                        </div>
                        <div class="flex items-center gap-2">
                            @if (tool.isAI) {
                            <span class="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full font-semibold">AI</span>
                            }
                            <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                                <i class="fa-solid fa-arrow-right text-gray-400 group-hover:text-emerald-600 text-sm transition-colors"></i>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900 text-lg mb-2 group-hover:text-emerald-600 transition-colors">{{ tool.name }}</h3>
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
export class FileToolsComponent {
    searchQuery = '';

    tools: Tool[] = [
        {
            name: 'Excel to CSV',
            description: 'Convert Excel spreadsheets to CSV format',
            icon: 'fa-solid fa-file-excel',
            iconColor: '#059669',
            bgColor: '#D1FAE5',
            link: 'excel-to-csv'
        },
        {
            name: 'CSV to Excel',
            description: 'Convert CSV files to Excel spreadsheets',
            icon: 'fa-solid fa-file-csv',
            iconColor: '#0EA5E9',
            bgColor: '#E0F2FE',
            link: 'csv-to-excel'
        },
        {
            name: 'Excel to JSON',
            description: 'Convert Excel spreadsheets to JSON format',
            icon: 'fa-solid fa-file-code',
            iconColor: '#F97316',
            bgColor: '#FFEDD5',
            link: 'excel-to-json'
        },
        {
            name: 'JSON to Excel',
            description: 'Convert JSON data to Excel spreadsheets',
            icon: 'fa-solid fa-table',
            iconColor: '#8B5CF6',
            bgColor: '#EDE9FE',
            link: 'json-to-excel'
        },
        {
            name: 'Image to CSV',
            description: 'Extract table data from images using AI',
            icon: 'fa-solid fa-wand-magic-sparkles',
            iconColor: '#EC4899',
            bgColor: '#FCE7F3',
            link: 'image-to-csv',
            isAI: true
        },
        {
            name: 'Image to Excel',
            description: 'Extract table data from images to Excel using AI',
            icon: 'fa-solid fa-wand-magic-sparkles',
            iconColor: '#6366F1',
            bgColor: '#E0E7FF',
            link: 'image-to-excel',
            isAI: true
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
