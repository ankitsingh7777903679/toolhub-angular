import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';

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

        <!-- SEO Content Section -->
        <div *ngIf="seoTitle" class="container mx-auto px-4 py-12 max-w-5xl">
            <div class="prose prose-lg max-w-none">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ seoTitle }}</h2>
                <p *ngIf="seoIntro" class="text-gray-600 mb-8">{{ seoIntro }}</p>
                
                <!-- How to Steps -->
                <div class="bg-white rounded-xl p-6 shadow-sm mb-8">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">How It Works</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="text-center p-4 border border-gray-100 rounded-xl">
                            <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" [style.backgroundColor]="headerBgColor">
                                <span class="font-bold text-lg" [style.color]="iconColor">1</span>
                            </div>
                            <h4 class="font-medium text-gray-800 mb-2">Enter Text</h4>
                            <p class="text-gray-500 text-sm">Provide your content or topic</p>
                        </div>
                        <div class="text-center p-4 border border-gray-100 rounded-xl">
                            <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" [style.backgroundColor]="headerBgColor">
                                <span class="font-bold text-lg" [style.color]="iconColor">2</span>
                            </div>
                            <h4 class="font-medium text-gray-800 mb-2">AI Processes</h4>
                            <p class="text-gray-500 text-sm">Gemini AI works its magic</p>
                        </div>
                        <div class="text-center p-4 border border-gray-100 rounded-xl">
                            <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" [style.backgroundColor]="headerBgColor">
                                <span class="font-bold text-lg" [style.color]="iconColor">3</span>
                            </div>
                            <h4 class="font-medium text-gray-800 mb-2">Copy Result</h4>
                            <p class="text-gray-500 text-sm">Use the content anywhere</p>
                        </div>
                    </div>
                </div>

                <!-- Features Grid -->
                <div *ngIf="features.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div *ngFor="let feature of features" class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-3" [style.backgroundColor]="headerBgColor">
                            <i [class]="feature.icon" [style.color]="iconColor"></i>
                        </div>
                        <h4 class="font-semibold text-gray-800 mb-2">{{ feature.title }}</h4>
                        <p class="text-gray-500 text-sm">{{ feature.description }}</p>
                    </div>
                </div>

                <!-- Use Cases -->
                <div *ngIf="useCases.length" class="rounded-xl p-6 mb-8" [style.backgroundColor]="headerBgColor">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fa-solid fa-lightbulb mr-2" [style.color]="iconColor"></i>Perfect For
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div *ngFor="let useCase of useCases" class="flex items-start gap-2">
                            <i class="fa-solid fa-check-circle mt-0.5" [style.color]="iconColor"></i>
                            <span class="text-gray-600">{{ useCase }}</span>
                        </div>
                    </div>
                </div>

                <!-- FAQ Section -->
                <div *ngIf="faqs.length" class="bg-white rounded-xl p-6 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">
                        <i class="fa-solid fa-circle-question mr-2" [style.color]="iconColor"></i>Frequently Asked Questions
                    </h3>
                    <div class="space-y-4">
                        <details *ngFor="let faq of faqs; let last = last" class="group pb-4" [class.border-b]="!last" [class.border-gray-100]="!last">
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
    private analyticsService = inject(AnalyticsService);

    title = '';
    description = '';
    promptType = '';
    inputLabel = 'Enter your text or topic';
    inputPlaceholder = 'Type here...';

    // Theme colors (default to blue)
    headerBgColor = '#DBEAFE';
    iconColor = '#3B82F6';
    iconClass = 'fa-solid fa-pen';

    // SEO Content
    seoTitle = '';
    seoIntro = '';
    features: { icon: string; title: string; description: string }[] = [];
    useCases: string[] = [];
    faqs: { question: string; answer: string }[] = [];

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

            // SEO Content
            if (data['seoTitle']) this.seoTitle = data['seoTitle'];
            if (data['seoIntro']) this.seoIntro = data['seoIntro'];
            if (data['features']) this.features = data['features'];
            if (data['useCases']) this.useCases = data['useCases'];
            if (data['faqs']) this.faqs = data['faqs'];

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
                this.http.post(`${environment.apiUrl}/ai/generate`, {
                    promptType: this.promptType,
                    text: this.userText
                })
            );

            this.generatedContent = response.text;
            this.analyticsService.trackToolUsage(
                `ai-${this.promptType}`,
                this.title,
                'ai-write'
            );
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
