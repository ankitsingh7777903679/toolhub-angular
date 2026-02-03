import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';

interface WriterConfig {
    promptType: string;
    title: string;
    subtitle: string;
    placeholder: string;
    showParagraphs: boolean;
    iconClass: string;
    iconColor: string;
    bgColor: string;
}

@Component({
    selector: 'app-ai-writer',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <div class="py-12 text-center" [style.backgroundColor]="config.bgColor">
            <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i [class]="config.iconClass + ' text-3xl'" [style.color]="config.iconColor"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ config.title }}</h1>
            <p class="text-gray-600">{{ config.subtitle }}</p>
        </div>

        <!-- Main Content -->
        <div class="container mx-auto px-4 py-8 max-w-6xl">
            <div class="grid lg:grid-cols-5 gap-6">
                
                <!-- Input Panel -->
                <div class="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                    <h2 class="font-bold text-lg text-gray-900 mb-4">Enter Prompt</h2>
                    
                    <textarea
                        [(ngModel)]="prompt"
                        rows="6"
                        [placeholder]="config.placeholder"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-gray-700">
                    </textarea>

                    <!-- Paragraphs Selector (shown for essay/assay) -->
                    <div *ngIf="config.showParagraphs" class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Number of Paragraphs</label>
                        <select 
                            [(ngModel)]="paragraphs"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none">
                            <option value="3">3 Paragraphs (Default)</option>
                            <option value="1">1 Paragraph</option>
                            <option value="2">2 Paragraphs</option>
                            <option value="4">4 Paragraphs</option>
                            <option value="5">5 Paragraphs</option>
                            <option value="6">6 Paragraphs</option>
                            <option value="7">7 Paragraphs</option>
                            <option value="8">8 Paragraphs</option>
                            <option value="9">9 Paragraphs</option>
                            <option value="10">10 Paragraphs</option>
                        </select>
                    </div>

                    <div *ngIf="error()" class="mt-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                        {{ error() }}
                    </div>

                    <button 
                        (click)="generate()"
                        [disabled]="isLoading()"
                        class="w-full mt-4 px-6 py-3.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200">
                        <ng-container *ngIf="isLoading(); else generateText">
                            <i class="fa-solid fa-spinner fa-spin mr-2"></i>
                            Generating...
                        </ng-container>
                        <ng-template #generateText>
                            <i class="fa-solid fa-wand-magic-sparkles mr-2"></i>
                            Generate
                        </ng-template>
                    </button>
                </div>

                <!-- Output Panel -->
                <div class="lg:col-span-3 bg-white rounded-2xl shadow-lg p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="font-bold text-lg text-gray-900">Generated Content</h2>
                        <button 
                            *ngIf="response()"
                            (click)="copyToClipboard()"
                            class="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <i [class]="copied() ? 'fa-solid fa-check text-green-600' : 'fa-solid fa-copy text-gray-600'"></i>
                            {{ copied() ? 'Copied!' : 'Copy' }}
                        </button>
                    </div>

                    <div 
                        class="min-h-[400px] p-4 bg-gray-50 rounded-xl border border-gray-100 overflow-y-auto"
                        style="max-height: 500px;">
                        
                        <!-- Loading State -->
                        <div *ngIf="isLoading()" class="flex items-center justify-center h-full min-h-[350px]">
                            <div class="text-center">
                                <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p class="text-gray-500 font-medium">Generating your content...</p>
                                <p class="text-gray-400 text-sm mt-1">This may take a few seconds</p>
                            </div>
                        </div>

                        <!-- Response Content -->
                        <div *ngIf="!isLoading() && response()" class="prose prose-sm max-w-none text-gray-700 leading-relaxed" [innerHTML]="response()"></div>

                        <!-- Empty State -->
                        <div *ngIf="!isLoading() && !response()" class="flex items-center justify-center h-full min-h-[350px]">
                            <div class="text-center text-gray-400">
                                <i [class]="config.iconClass + ' text-5xl mb-4 opacity-50'"></i>
                                <p class="font-medium">Your generated content will appear here</p>
                                <p class="text-sm mt-1">Enter a prompt and click Generate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    styles: [`
        .prose h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; }
        .prose h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem; }
        .prose h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 0.75rem; }
        .prose strong { font-weight: 600; }
        .prose em { font-style: italic; }
    `]
})
export class AiWriterComponent {
    @Input() config: WriterConfig = {
        promptType: 'default',
        title: 'AI Writer',
        subtitle: 'Generate content with AI',
        placeholder: 'Enter your prompt here...',
        showParagraphs: false,
        iconClass: 'fa-solid fa-pen-nib',
        iconColor: '#3B82F6',
        bgColor: '#EFF6FF'
    };

    private apiService = inject(ApiService);
    private analyticsService = inject(AnalyticsService);

    prompt = '';
    paragraphs = '3';
    response = signal('');
    isLoading = signal(false);
    error = signal('');
    copied = signal(false);

    generate(): void {
        if (!this.prompt.trim()) {
            this.error.set('Please enter a prompt');
            return;
        }

        this.isLoading.set(true);
        this.error.set('');
        this.response.set('');

        this.apiService.generateAIContent(
            this.config.promptType,
            this.prompt,
            this.config.showParagraphs ? parseInt(this.paragraphs) : undefined
        ).subscribe({
            next: (result: any) => {
                const text = result.text || result;
                this.response.set(this.formatResponse(String(text)));
                this.isLoading.set(false);
                this.analyticsService.trackToolUsage(
                    `ai-${this.config.promptType}`,
                    this.config.title,
                    'ai-write'
                );
            },
            error: (err: any) => {
                this.error.set(err.error?.message || 'Failed to generate content. Please try again.');
                this.isLoading.set(false);
            }
        });
    }

    formatResponse(text: string): string {
        let formatted = text;

        // Convert markdown headers
        formatted = formatted.replace(/^###\s(.+)/gm, '<h3>$1</h3>');
        formatted = formatted.replace(/^##\s(.+)/gm, '<h2>$1</h2>');
        formatted = formatted.replace(/^#\s(.+)/gm, '<h1>$1</h1>');

        // Convert bold and italic
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Convert line breaks
        formatted = formatted.replace(/\n/g, '<br>');

        return formatted;
    }

    copyToClipboard(): void {
        const textContent = this.response()
            .replace(/<[^>]*>/g, '')
            .replace(/<br>/g, '\n');

        navigator.clipboard.writeText(textContent).then(() => {
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        });
    }
}
