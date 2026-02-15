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
    <div class="min-h-screen bg-white dark:bg-slate-900">
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
                    <div class="bg-white dark:bg-slate-800 rounded-full p-2 flex items-center shadow-lg">
                        <i class="fa-solid fa-magnifying-glass text-gray-400 ml-2 mr-2"></i>
                        <input 
                            type="text" 
                            [(ngModel)]="searchQuery" 
                            (input)="filterTools()"
                            placeholder="Search for a file tool..." 
                            class="flex-1 outline-none text-gray-700 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 min-w-0 py-1 bg-transparent">
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
                    class="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
                            <div class="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 transition-colors">
                                <i class="fa-solid fa-arrow-right text-gray-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 text-sm transition-colors"></i>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{{ tool.name }}</h3>
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
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Stop Wrestling with File Formats</h2>
            <p class="text-gray-600 dark:text-slate-400 mb-8 leading-relaxed">
                You've got data in one format and need it in another. Maybe your client sent an Excel file but your database only accepts CSV. Maybe you pulled JSON from an API and your boss wants it in a spreadsheet. Or maybe you're staring at a photo of a handwritten table wondering if you really have to type all that data in manually. These tools handle the boring stuff so you don't have to.
            </p>

            <h2 class="text-2xl font-bold text-gray-800 dark:text-slate-200 mb-4">Spreadsheets, CSV, JSON — Whatever You Need</h2>
            <p class="text-gray-600 dark:text-slate-400 mb-8 leading-relaxed">
                The most common headache? Getting data from Excel into something a database can actually read. CSV solves that — it's the universal format that pretty much everything accepts. Going the other direction, CSV to Excel is great when you want to add formulas, charts, or just make a flat file look presentable. For developers, Excel to JSON turns spreadsheet data into something your React app or API can actually use. And JSON to Excel? Perfect for when your manager asks "can you put that in a spreadsheet?" for the hundredth time.
            </p>

            <h2 class="text-2xl font-bold text-gray-800 dark:text-slate-200 mb-4">Got a Photo of a Table? AI Can Read It</h2>
            <p class="text-gray-600 dark:text-slate-400 mb-8 leading-relaxed">
                This is the one that saves the most time. Take a picture of a printed table, a receipt, an invoice, or even a handwritten attendance register — the AI figures out where the rows and columns are and turns it into a proper spreadsheet. It's not magic (blurry photos will give you blurry results), but for clear images, it works surprisingly well and beats manual data entry every single time.
            </p>
        </article>
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
