import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-generic-write',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <div class="py-12 text-center" [style.background-color]="headerBgColor">
            <div class="w-16 h-16 bg-white/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i [class]="iconClass + ' text-3xl'" [style.color]="iconColor"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ title }}</h1>
            <p class="text-gray-600">{{ description }}</p>
        </div>

        <div class="container mx-auto px-4 py-8">
            <div class="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                <!-- Input Section -->
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full min-h-[500px]">
                    <div class="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                         <i [class]="iconClass + ' text-xl'" [style.color]="iconColor"></i>
                        <h2 class="font-bold text-gray-800">Your Input</h2>
                    </div>
                    
                    <div class="p-6 flex-1 flex flex-col">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            {{ inputLabel }}
                        </label>
                        <textarea 
                            [(ngModel)]="userText" 
                            [placeholder]="inputPlaceholder"
                            class="w-full flex-1 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white transition-all outline-none resize-none font-medium text-gray-700 leading-relaxed"
                            rows="10"
                        ></textarea>
                        
                        <div class="mt-6">
                            <button 
                                (click)="generate()" 
                                [disabled]="!userText || isGenerating"
                                class="w-full py-4 text-white font-bold rounded-xl shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                [style.background-color]="iconColor">
                                <span *ngIf="isGenerating" class="flex items-center gap-2">
                                    <i class="fa-solid fa-circle-notch fa-spin"></i>
                                    Writing Magic...
                                </span>
                                <span *ngIf="!isGenerating" class="flex items-center gap-2">
                                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                                    Generate Content
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Output Section -->
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-full min-h-[500px]">
                    <div class="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <i class="fa-solid fa-robot text-xl text-purple-500"></i>
                            <h2 class="font-bold text-gray-800">AI Response</h2>
                        </div>
                        <button 
                            *ngIf="generatedContent"
                            (click)="copyToClipboard()" 
                            class="text-sm font-bold text-gray-500 hover:text-blue-600 flex items-center gap-2 transition-colors">
                            <i class="fa-regular fa-copy"></i> Copy
                        </button>
                    </div>
                    
                    <div class="p-6 flex-1 bg-gray-50/50">
                        <div *ngIf="!generatedContent && !isGenerating" class="h-full flex flex-col items-center justify-center text-gray-400">
                             <i [class]="iconClass + ' text-5xl mb-4 opacity-20'"></i>
                            <p>Content will appear here</p>
                        </div>

                        <div *ngIf="isGenerating" class="h-full flex flex-col items-center justify-center">
                            <div class="relative w-20 h-20">
                                <div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                                <div class="absolute inset-0 border-4 border-t-transparent rounded-full animate-spin" [style.border-color]="iconColor + ' transparent transparent transparent'"></div>
                            </div>
                            <p class="mt-4 text-gray-500 font-medium animate-pulse">AI is thinking...</p>
                        </div>

                        <div *ngIf="generatedContent" class="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line animate-fadeIn">
                            {{ generatedContent }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `,
    styles: [`
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
    }
  `]
})
export class GenericWriteComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private http = inject(HttpClient);
    private cdr = inject(ChangeDetectorRef);

    title = '';
    description = '';
    promptType = '';
    inputLabel = 'Enter your text or topic';
    inputPlaceholder = 'Type here...';

    // Theme colors (default to blue)
    headerBgColor = '#DBEAFE';
    iconColor = '#3B82F6';
    iconClass = 'fa-solid fa-pen';

    userText = '';
    generatedContent = '';
    isGenerating = false;

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.title = data['title'];
            this.description = data['description'];
            this.promptType = data['promptType'];

            if (data['inputLabel']) this.inputLabel = data['inputLabel'];
            if (data['inputPlaceholder']) this.inputPlaceholder = data['inputPlaceholder'];

            if (data['headerBgColor']) this.headerBgColor = data['headerBgColor'];
            if (data['iconColor']) this.iconColor = data['iconColor'];
            if (data['iconClass']) this.iconClass = data['iconClass'];

            // Clear state on route change
            this.userText = '';
            this.generatedContent = '';
        });
    }

    async generate() {
        if (!this.userText || this.isGenerating) return;

        this.isGenerating = true;
        this.generatedContent = '';

        try {
            const response: any = await firstValueFrom(
                this.http.post('http://localhost:3000/api/ai/generate', {
                    promptType: this.promptType,
                    text: this.userText
                })
            );

            this.generatedContent = response.text;
        } catch (error) {
            console.error('Generation failed', error);
            this.generatedContent = 'Sorry, something went wrong. Please try again.';
        } finally {
            this.isGenerating = false;
            this.cdr.detectChanges(); // Force UI update
        }
    }

    copyToClipboard() {
        navigator.clipboard.writeText(this.generatedContent);
    }
}
