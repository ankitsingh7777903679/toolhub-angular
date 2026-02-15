import { Component, ChangeDetectorRef, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { ScriptLoaderService } from '../../../core/services/script-loader.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SeoService } from '../../../core/services/seo.service';

declare const saveAs: any;

@Component({
    selector: 'app-remove-bg',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Header -->
        <div class="py-12 text-center" style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);">
            <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-eraser text-3xl text-white"></i>
            </div>
            <h1 class="text-3xl font-bold text-white mb-2">Remove Background</h1>
            <p class="text-white/80">Automatically remove background from any image</p>
        </div>

        <div class="container mx-auto px-4 py-8">
            <div class="max-w-4xl mx-auto">
                
                <!-- Upload Area -->
                <div *ngIf="!originalImage" 
                     class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-cyan-500 transition-colors cursor-pointer"
                     (click)="fileInput.click()"
                     (dragover)="onDragOver($event)"
                     (drop)="onDrop($event)">
                    <input #fileInput type="file" accept="image/*" (change)="onFileSelect($event)" class="hidden">
                    <i class="fa-solid fa-cloud-arrow-up text-5xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600 dark:text-gray-300 font-medium text-lg">Click or drag image to remove background</p>
                    <p class="text-gray-400 text-sm mt-2">Supports JPG, PNG, WebP</p>
                </div>

                <!-- Image Comparison -->
                <div *ngIf="originalImage" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    
                    <!-- Status -->
                    <div *ngIf="isProcessing" class="text-center py-8">
                        <i class="fa-solid fa-eraser text-5xl text-cyan-500 animate-pulse mb-4"></i>
                        <p class="text-gray-600 dark:text-gray-300 font-medium">Removing background with AI...</p>
                        <p class="text-gray-400 text-sm mt-2">This may take 20-40 seconds</p>
                        <div class="mt-4 w-48 mx-auto">
                            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div class="h-full bg-cyan-500 rounded-full animate-pulse" style="width: 60%;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Before/After Comparison -->
                    <div *ngIf="!isProcessing" class="grid md:grid-cols-2 gap-6">
                        <!-- Original -->
                        <div class="text-center">
                            <h3 class="font-bold text-gray-800 dark:text-white mb-3">
                                <i class="fa-solid fa-image text-gray-400 mr-2"></i>Original
                            </h3>
                            <div class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                <img [src]="originalImage" class="w-full h-auto max-h-80 object-contain">
                            </div>
                            <p class="text-xs text-gray-400 mt-2">{{ originalFileName }}</p>
                        </div>

                        <!-- Processed -->
                        <div class="text-center">
                            <h3 class="font-bold text-gray-800 dark:text-white mb-3">
                                <i class="fa-solid fa-check-circle text-cyan-500 mr-2"></i>Background Removed
                            </h3>
                            <div class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden min-h-[200px] flex items-center justify-center" 
                                 [style.background]="selectedBgColor === 'transparent' ? 'repeating-conic-gradient(#e5e5e5 0% 25%, #ffffff 0% 50%) 50% / 20px 20px' : selectedBgColor">
                                <img *ngIf="processedImage" [src]="processedImage" class="w-full h-auto max-h-80 object-contain">
                                <div *ngIf="!processedImage && !error" class="text-gray-400 bg-white/80 px-4 py-2 rounded">
                                    <i class="fa-solid fa-arrow-up text-2xl mb-2"></i>
                                    <p class="text-sm">Click "Remove Background" to start</p>
                                </div>
                                <div *ngIf="error" class="text-red-500 p-4 bg-white/80 rounded">
                                    <i class="fa-solid fa-circle-exclamation text-2xl mb-2"></i>
                                    <p class="text-sm">{{ error }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Background Color Picker (only show after processing) -->
                    <div *ngIf="processedImage && !isProcessing" class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h4 class="font-bold text-gray-800 dark:text-white mb-3 text-center">
                            <i class="fa-solid fa-palette text-cyan-500 mr-2"></i>Set Background Color
                        </h4>
                        
                        <!-- Preset Colors -->
                        <div class="flex flex-wrap justify-center gap-2 mb-4">
                            <!-- Transparent -->
                            <button 
                                (click)="selectBgColor('transparent')"
                                class="w-10 h-10 rounded-lg border-2 transition-all hover:scale-110"
                                [class.ring-2]="selectedBgColor === 'transparent'"
                                [class.ring-cyan-500]="selectedBgColor === 'transparent'"
                                style="background: repeating-conic-gradient(#e5e5e5 0% 25%, #ffffff 0% 50%) 50% / 10px 10px;"
                                title="Transparent">
                            </button>
                            
                            <!-- Preset Colors -->
                            <button *ngFor="let color of presetColors"
                                (click)="selectBgColor(color)"
                                class="w-10 h-10 rounded-lg border-2 border-gray-300 transition-all hover:scale-110"
                                [class.ring-2]="selectedBgColor === color"
                                [class.ring-cyan-500]="selectedBgColor === color"
                                [style.backgroundColor]="color"
                                [title]="color">
                            </button>
                            
                            <!-- Custom Color Picker -->
                            <div class="relative">
                                <input 
                                    type="color" 
                                    [(ngModel)]="customColor"
                                    (change)="selectBgColor(customColor)"
                                    class="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                                    title="Custom Color">
                            </div>
                        </div>
                        
                        <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
                            Selected: {{ selectedBgColor === 'transparent' ? 'Transparent (PNG)' : selectedBgColor }}
                        </p>
                    </div>

                    <!-- Action Buttons -->
                    <div *ngIf="!isProcessing" class="flex flex-col md:flex-row gap-4 justify-center md:items-end mt-6">
                        <div class="flex flex-col gap-2 w-full md:w-auto">
                            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Select Model:</label>
                            <select [(ngModel)]="selectedModel" 
                                    class="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-full">
                                <option *ngFor="let model of availableModels" [value]="model">{{ model }}</option>
                            </select>
                        </div>
                        
                        <button *ngIf="!processedImage" (click)="removeBackground()" 
                                class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-bold hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg w-full md:w-auto">
                            <i class="fa-solid fa-eraser"></i> Remove Background
                        </button>
                        
                        <button *ngIf="processedImage" (click)="downloadProcessed()" 
                                class="px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg w-full md:w-auto">
                            <i class="fa-solid fa-download"></i> 
                            {{ selectedBgColor === 'transparent' ? 'Download PNG' : 'Download with Background' }}
                        </button>
                        
                        <!-- Send to Tool -->
                        <div *ngIf="processedImage" class="w-full md:w-auto">
                            <app-send-to-tool
                                [hasOutput]="!!processedImage"
                                [currentRoute]="currentRoute"
                                [outputData]="processedImage"
                                [fileName]="getOutputFileName()"
                                [fileType]="'image'">
                            </app-send-to-tool>
                        </div>
                        
                        <button (click)="reset()" 
                                class="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 w-full md:w-auto">
                            <i class="fa-solid fa-rotate"></i> Try Another
                        </button>
                    </div>
                </div>

                <!-- Info Section -->
                <div class="mt-8 grid md:grid-cols-3 gap-4">
                    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
                        <i class="fa-solid fa-magic text-cyan-500 text-2xl mb-2"></i>
                        <h4 class="font-bold text-gray-800 dark:text-white">Automatic</h4>
                        <p class="text-gray-500 text-sm">No manual selection needed</p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
                        <i class="fa-solid fa-palette text-cyan-500 text-2xl mb-2"></i>
                        <h4 class="font-bold text-gray-800 dark:text-white">Custom Background</h4>
                        <p class="text-gray-500 text-sm">Add any color background</p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
                        <i class="fa-solid fa-robot text-cyan-500 text-2xl mb-2"></i>
                        <h4 class="font-bold text-gray-800 dark:text-white">AI Powered</h4>
                        <p class="text-gray-500 text-sm">Advanced neural network</p>
                    </div>
                </div>

                <!-- Example Showcase (Before & After Slider) -->
                <div *ngIf="!originalImage" class="mt-16 mb-8">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-white text-center mb-8">See Examples</h2>
                    <div class="grid md:grid-cols-3 gap-8">
                        <div *ngFor="let ex of examples; let i = index" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                            <div class="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-600 flex justify-center items-center">
                                <h3 class="font-bold text-gray-700 dark:text-gray-200">{{ ex.name }}</h3>
                            </div>
                            <div class="p-0 relative h-48 sm:h-64 cursor-ew-resize group select-none">
                                <!-- Processed Image (Background/After) - Shows fully when slider is at 0 -->
                                <div class="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAjyQc6wcXEgCjGZZJM66DqqAAAAAElFTkSuQmCC')]">
                                    <img [src]="ex.processed" class="w-full h-full object-cover" loading="lazy" fetchpriority="low" [alt]="ex.name + ' Processed'">
                                    <span class="absolute bottom-4 right-4 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded z-10">AFTER</span>
                                </div>

                                <!-- Original Image (Foreground/Before) - Clipped by width -->
                                <div class="absolute inset-0 overflow-hidden border-r-2 border-white" [style.width.%]="sliderValues[i] || 50">
                                    <img [src]="ex.original" class="w-full h-full max-w-none object-cover" [style.width.%]="100 / ((sliderValues[i] || 50) / 100)" loading="lazy" fetchpriority="low" [alt]="ex.name">
                                    <span class="absolute bottom-4 left-4 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded z-10">BEFORE</span>
                                </div>

                                <!-- Slider Handle -->
                                <div class="absolute inset-y-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)]" [style.left.%]="sliderValues[i] || 50">
                                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                                        <i class="fa-solid fa-arrows-left-right text-gray-400 text-xs"></i>
                                    </div>
                                </div>

                                <!-- Range Input Overlay -->
                                <input type="range" min="0" max="100" [value]="sliderValues[i] || 50" 
                                       (input)="updateSlider($event, i)"
                                       class="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20 m-0 p-0">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SEO Content -->
                <article class="prose lg:prose-xl mx-auto mt-16 px-4 max-w-4xl">
                    <h2 class="text-3xl font-bold text-gray-900 mb-6">Remove Background — Clean Cutouts Without the Photoshop Hassle</h2>
                    <p class="text-gray-600 mb-8 leading-relaxed">
                        You know the drill: you need a product photo with a white background for your shop, or a headshot without the messy living room behind you, or just a clean cutout of an object for a design project. In Photoshop, that means layer masks, edge refinement, maybe an hour of careful selection work. Here, you upload the image, click one button, and the AI handles the rest in about 5-15 seconds.
                    </p>
                    <p class="text-gray-600 mb-8 leading-relaxed">
                        The model is specifically good at tricky edges — hair, fur, lace, semi-transparent fabrics, the stuff that makes manual cutouts painful. After the background is gone, you can keep the transparency (great for logos and overlays), or pick a solid background color from the presets. There's also a custom hex input if you need a specific brand color. Download the result as a PNG and you're done.
                    </p>

                    <h2 class="text-2xl font-bold text-gray-800 mb-4">E-Commerce Product Photography</h2>
                    <p class="text-gray-600 mb-8 leading-relaxed">
                        Amazon, Etsy, eBay — they all want product images on clean white backgrounds. Hiring a photographer with a proper backdrop is ideal, but if you've got fifty products photographed on your kitchen table, this tool will get you to "good enough" surprisingly fast. Upload the product photo, let the AI strip the background, set it to white, and download. Repeat for the next 49. It handles complex product shapes (shoes, jewelry, electronics) really well.
                    </p>

                    <h2 class="text-2xl font-bold text-gray-800 mb-4">How It Handles Your Data</h2>
                    <p class="text-gray-600 mb-8 leading-relaxed">
                        The image does get sent to our AI server for processing — background removal requires a neural network model that's too large to run in a browser. But it's processed entirely in memory and deleted the moment your result is ready. Nothing is stored, logged, or retained.
                    </p>

                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                    <div class="space-y-4">
                        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h3 class="font-bold text-gray-900 mb-2">How does it handle messy backgrounds like outdoor scenes?</h3>
                            <p class="text-gray-600">Really well, actually. The AI was trained on all kinds of scenes — outdoor, indoor, crowded, patterned. It focuses on identifying the foreground subject rather than analyzing the background, so complexity behind the subject doesn't throw it off much.</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h3 class="font-bold text-gray-900 mb-2">What about wispy hair or fuzzy edges?</h3>
                            <p class="text-gray-600">This is where the AI really shines compared to manual tools. It preserves individual hair strands, fur textures, and semi-transparent materials that would take ages to mask by hand. The results aren't perfect 100% of the time, but they're consistently impressive.</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h3 class="font-bold text-gray-900 mb-2">Can I add a specific color behind the subject?</h3>
                            <p class="text-gray-600">Yes — after the background is removed you'll see color presets (white, black, red, blue, and several others). There's also a hex color input for any specific shade. Pick a color and it fills the background instantly.</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h3 class="font-bold text-gray-900 mb-2">Is this really free? No hidden limits?</h3>
                            <p class="text-gray-600">Completely free — no watermarks, no account required, no caps on how many images you process. Use it as much as you want.</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h3 class="font-bold text-gray-900 mb-2">Where does the processing happen?</h3>
                            <p class="text-gray-600">On our AI server. The image is uploaded, processed in memory by the RemBG neural network, and the result is sent back to your browser. The original image is deleted immediately after — nothing is kept on our end.</p>
                        </div>
                    </div>
                </article>

            </div>
        </div>
    </div>
  `
})
export class RemoveBgComponent implements OnInit {
    originalImage: string | null = null;
    processedImage: string | null = null;
    originalFileName = '';
    isProcessing = false;
    error = '';
    currentRoute = '/image/remove-bg';

    // Background color options
    selectedBgColor = 'transparent';
    customColor = '#ffffff';
    presetColors = [
        '#ffffff', // White
        '#000000', // Black
        '#f43f5e', // Red
        '#22c55e', // Green
        '#3b82f6', // Blue
        '#eab308', // Yellow
        '#a855f7', // Purple
        '#ec4899', // Pink
        '#06b6d4', // Cyan
        '#f97316'  // Orange
    ];

    // Model selection
    selectedModel = 'bria-rmbg';
    availableModels = [
        // 'u2net',
        // 'u2netp',
        // 'u2net_human_seg',
        // 'silueta',
        // 'isnet-general-use',
        'isnet-anime',
        // 'sam',
        'bria-rmbg',
        // 'birefnet-general',
        // 'birefnet-general-lite',
        'birefnet-portrait',
        // 'birefnet-dis',
        'birefnet-hrsod',
        // 'birefnet-cod',
        'birefnet-massive'
    ];

    private apiUrl = environment.apiUrl;
    constructor(
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone,
        private workspaceService: WorkspaceService,
        private scriptLoader: ScriptLoaderService,
        private analyticsService: AnalyticsService,
        private seoService: SeoService
    ) { }

    async ngOnInit(): Promise<void> {
        this.seoService.updateSeo({
            title: 'Remove Background from Image Free - Online Background Remover',
            description: 'Remove background from images instantly with our free AI background remover. Download transparent PNGs or add custom backgrounds.',
            keywords: 'remove background, background remover, transparent background, free background remover, ai background removal, online photo editor',
            url: 'https://2olhub.netlify.app/image/remove-bg'
        });
        this.seoService.setFaqJsonLd([
            { question: 'How does it handle messy backgrounds like outdoor scenes?', answer: 'Really well. The AI focuses on identifying the foreground subject rather than analyzing the background, so complexity doesn\'t throw it off.' },
            { question: 'What about wispy hair or fuzzy edges?', answer: 'The AI preserves individual hair strands, fur textures, and semi-transparent materials that would take ages to mask by hand.' },
            { question: 'Can I add a specific color behind the subject?', answer: 'Yes — after removal you\'ll see color presets and a hex input. Pick a color and it fills the background instantly.' },
            { question: 'Is this really free? No hidden limits?', answer: 'Completely free — no watermarks, no account required, no caps on how many images you process.' },
            { question: 'Where does the processing happen?', answer: 'On our AI server. The image is processed in memory and the original is deleted immediately after — nothing is kept.' }
        ]);

        if (this.workspaceService.hasFile()) {
            const file = this.workspaceService.getFile();
            if (file && file.fileType === 'image') {
                this.originalImage = file.data;
                this.originalFileName = file.fileName;
                this.cdr.detectChanges();
            }
        }
    }

    getOutputFileName(): string {
        return this.originalFileName.replace(/\.[^/.]+$/, '') + '_nobg.png';
    }

    onFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.handleFile(input.files[0]);
        }
        input.value = '';
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer?.files[0]) {
            this.handleFile(event.dataTransfer.files[0]);
        }
    }

    handleFile(file: File) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        this.originalFileName = file.name;
        this.processedImage = null;
        this.error = '';
        this.selectedBgColor = 'transparent';

        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.originalImage = e.target.result;
            this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
    }

    selectBgColor(color: string) {
        this.selectedBgColor = color;
        this.cdr.detectChanges();
    }

    async removeBackground() {
        if (!this.originalImage) return;

        this.isProcessing = true;
        this.error = '';
        this.cdr.detectChanges();

        try {
            const response = await fetch(`${this.apiUrl}/rembg/remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image: this.originalImage,
                    model: this.selectedModel
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Background removal failed');
            }

            this.ngZone.run(() => {
                this.processedImage = result.processed;
                this.isProcessing = false;
                this.analyticsService.trackToolUsage('remove-bg', 'Remove Background', 'image');
                this.cdr.detectChanges();
            });

        } catch (error: any) {
            console.error('Background removal error:', error);
            this.ngZone.run(() => {
                this.error = error.message || 'Failed to remove background';
                this.isProcessing = false;
                this.cdr.detectChanges();
            });
        }
    }

    async downloadProcessed() {
        if (!this.processedImage) return;

        // Load file-saver only when needed
        await this.scriptLoader.load(['file-saver']);

        if (this.selectedBgColor === 'transparent') {
            // Download as transparent PNG
            this.downloadTransparentPng();
        } else {
            // Download with colored background
            this.downloadWithBackground();
        }
    }

    private downloadTransparentPng() {
        const base64Data = this.processedImage!.replace(/^data:image\/\w+;base64,/, '');
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });

        const fileName = this.originalFileName.replace(/\.[^/.]+$/, '') + '_nobg.png';
        saveAs(blob, fileName);
    }

    private downloadWithBackground() {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d')!;

            // Fill with selected background color
            ctx.fillStyle = this.selectedBgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw the transparent image on top
            ctx.drawImage(img, 0, 0);

            // Convert to blob and download
            canvas.toBlob((blob) => {
                if (blob) {
                    const fileName = this.originalFileName.replace(/\.[^/.]+$/, '') + '_colored_bg.png';
                    saveAs(blob, fileName);
                }
            }, 'image/png');
        };
        img.src = this.processedImage!;
    }

    examples = [
        { original: 'assets/examples/product.webp', processed: 'assets/examples/product_nobg.webp', name: 'Product Example' },
        { original: 'assets/examples/portrait.webp', processed: 'assets/examples/portrait_nobg.webp', name: 'Portrait Example' },
        { original: 'assets/examples/sneaker_product.webp', processed: 'assets/examples/sneaker_product_nobg.webp', name: 'Sneaker Product Example' },
        { original: 'assets/examples/lightingGirl.webp', processed: 'assets/examples/lightingGirl_nobg.webp', name: 'Lighting Girl Example' },
        { original: 'assets/examples/shadowMan.webp', processed: 'assets/examples/shadowMan_nobg.webp', name: 'Shadow Man Example' },
        { original: 'assets/examples/friendsGroup.webp', processed: 'assets/examples/friendsGroup_nobg.webp', name: 'Friends Group Example' }
    ];

    sliderValues: { [key: number]: number } = {};

    updateSlider(event: Event, index: number) {
        const input = event.target as HTMLInputElement;
        this.sliderValues[index] = Number(input.value);
    }

    async loadExample(example: any) {
        try {
            // Load original image
            const originalResponse = await fetch(example.original);
            const originalBlob = await originalResponse.blob();
            this.originalImage = await this.blobToBase64(originalBlob);
            this.originalFileName = example.name + '.jpg';

            // Load processed image
            const processedResponse = await fetch(example.processed);
            const processedBlob = await processedResponse.blob();
            this.processedImage = await this.blobToBase64(processedBlob);

            this.selectedBgColor = 'transparent';
            this.error = '';
            this.cdr.detectChanges();

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error loading example:', error);
            this.error = 'Failed to load example image';
            this.cdr.detectChanges();
        }
    }

    private blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    reset() {
        this.originalImage = null;
        this.processedImage = null;
        this.originalFileName = '';
        this.error = '';
        this.selectedBgColor = 'transparent';
    }
}
