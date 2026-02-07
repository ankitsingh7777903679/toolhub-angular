import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';

interface SeoFeature {
    icon: string;
    title: string;
    description: string;
}

interface SeoFaq {
    question: string;
    answer: string;
}

interface WriterConfig {
    promptType: string;
    title: string;
    subtitle: string;
    placeholder: string;
    showParagraphs: boolean;
    iconClass: string;
    iconColor: string;
    bgColor: string;
    // SEO Content
    seoTitle?: string;
    seoIntro?: string;
    features?: SeoFeature[];
    useCases?: string[];
    faqs?: SeoFaq[];
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

        <!-- SEO Content Section -->
        <div *ngIf="config.seoTitle" class="container mx-auto px-4 py-12 max-w-5xl">
            <div class="prose prose-lg max-w-none">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ config.seoTitle }}</h2>
                <p *ngIf="config.seoIntro" class="text-gray-600 mb-8">{{ config.seoIntro }}</p>
                
                <!-- How to Steps -->
                <div class="bg-white rounded-xl p-6 shadow-sm mb-8">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">How It Works</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="text-center p-4 border border-gray-100 rounded-xl">
                            <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" [style.backgroundColor]="config.bgColor">
                                <span class="font-bold text-lg" [style.color]="config.iconColor">1</span>
                            </div>
                            <h4 class="font-medium text-gray-800 mb-2">Enter Prompt</h4>
                            <p class="text-gray-500 text-sm">Describe what you want to create</p>
                        </div>
                        <div class="text-center p-4 border border-gray-100 rounded-xl">
                            <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" [style.backgroundColor]="config.bgColor">
                                <span class="font-bold text-lg" [style.color]="config.iconColor">2</span>
                            </div>
                            <h4 class="font-medium text-gray-800 mb-2">AI Generates</h4>
                            <p class="text-gray-500 text-sm">Gemini AI creates your content</p>
                        </div>
                        <div class="text-center p-4 border border-gray-100 rounded-xl">
                            <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" [style.backgroundColor]="config.bgColor">
                                <span class="font-bold text-lg" [style.color]="config.iconColor">3</span>
                            </div>
                            <h4 class="font-medium text-gray-800 mb-2">Copy & Use</h4>
                            <p class="text-gray-500 text-sm">Copy the result and use anywhere</p>
                        </div>
                    </div>
                </div>

                <!-- Features Grid -->
                <div *ngIf="config.features?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div *ngFor="let feature of config.features" class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-3" [style.backgroundColor]="config.bgColor">
                            <i [class]="feature.icon" [style.color]="config.iconColor"></i>
                        </div>
                        <h4 class="font-semibold text-gray-800 mb-2">{{ feature.title }}</h4>
                        <p class="text-gray-500 text-sm">{{ feature.description }}</p>
                    </div>
                </div>

                <!-- Use Cases -->
                <div *ngIf="config.useCases?.length" class="rounded-xl p-6 mb-8" [style.backgroundColor]="config.bgColor">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fa-solid fa-lightbulb mr-2" [style.color]="config.iconColor"></i>Perfect For
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div *ngFor="let useCase of config.useCases" class="flex items-start gap-2">
                            <i class="fa-solid fa-check-circle mt-0.5" [style.color]="config.iconColor"></i>
                            <span class="text-gray-600">{{ useCase }}</span>
                        </div>
                    </div>
                </div>

                <!-- FAQ Section -->
                <div *ngIf="config.faqs?.length" class="bg-white rounded-xl p-6 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fa-solid fa-circle-question mr-2" [style.color]="config.iconColor"></i>Frequently Asked Questions
                    </h3>
                    <div class="space-y-4">
                        <details *ngFor="let faq of config.faqs; let last = last" class="group pb-4" [class.border-b]="!last" [class.border-gray-100]="!last">
                            <summary class="font-medium text-gray-700 cursor-pointer flex justify-between items-center">
                                {{ faq.question }}
                                <i class="fa-solid fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform"></i>
                            </summary>
                            <p class="mt-3 text-gray-600 text-sm">{{ faq.answer }}</p>
                        </details>
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
