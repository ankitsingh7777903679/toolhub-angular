import { Component, ChangeDetectorRef, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SeoService } from '../../../core/services/seo.service';

declare const saveAs: any;

@Component({
    selector: 'app-image-enhancer',
    standalone: true,
    imports: [CommonModule, SendToToolComponent],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Header -->
        <div class="py-12 text-center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-wand-magic-sparkles text-3xl text-white"></i>
            </div>
            <h1 class="text-3xl font-bold text-white mb-2">AI Image Enhancer</h1>
            <p class="text-white/80">Enhance and upscale blurry images with AI</p>
        </div>

        <div class="container mx-auto px-4 py-8">
            <div class="max-w-4xl mx-auto">
                
                <!-- Upload Area -->
                <div *ngIf="!originalImage" 
                     class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-500 transition-colors cursor-pointer"
                     (click)="fileInput.click()"
                     (dragover)="onDragOver($event)"
                     (drop)="onDrop($event)">
                    <input #fileInput type="file" accept="image/*" (change)="onFileSelect($event)" class="hidden">
                    <i class="fa-solid fa-cloud-arrow-up text-5xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600 dark:text-gray-300 font-medium text-lg">Click or drag image to enhance</p>
                    <p class="text-gray-400 text-sm mt-2">Supports JPG, PNG, WebP</p>
                </div>

                <!-- Image Comparison -->
                <div *ngIf="originalImage" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    
                    <!-- Status -->
                    <div *ngIf="isProcessing" class="text-center py-8">
                        <i class="fa-solid fa-wand-magic-sparkles text-5xl text-purple-500 animate-pulse mb-4"></i>
                        <p class="text-gray-600 dark:text-gray-300 font-medium">Enhancing your image with AI...</p>
                        <p class="text-gray-400 text-sm mt-2">This may take 30-60 seconds</p>
                        <div class="mt-4 w-48 mx-auto">
                            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div class="h-full bg-purple-500 rounded-full animate-pulse" style="width: 60%;"></div>
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

                        <!-- Enhanced -->
                        <div class="text-center">
                            <h3 class="font-bold text-gray-800 dark:text-white mb-3">
                                <i class="fa-solid fa-sparkles text-purple-500 mr-2"></i>Enhanced
                            </h3>
                            <div class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 min-h-[200px] flex items-center justify-center">
                                <img *ngIf="enhancedImage" [src]="enhancedImage" class="w-full h-auto max-h-80 object-contain">
                                <div *ngIf="!enhancedImage && !error" class="text-gray-400">
                                    <i class="fa-solid fa-arrow-up text-2xl mb-2"></i>
                                    <p class="text-sm">Click "Enhance" to start</p>
                                </div>
                                <div *ngIf="error" class="text-red-500 p-4">
                                    <i class="fa-solid fa-circle-exclamation text-2xl mb-2"></i>
                                    <p class="text-sm">{{ error }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div *ngIf="!isProcessing" class="flex flex-col md:flex-row gap-4 justify-center mt-6">
                        <button *ngIf="!enhancedImage" (click)="enhanceImage()" 
                                class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2 shadow-lg">
                            <i class="fa-solid fa-wand-magic-sparkles"></i> Enhance Image
                        </button>
                        
                        <button *ngIf="enhancedImage" (click)="downloadEnhanced()" 
                                class="px-6 py-3 bg-green-500 text-white justify-center align-center rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center gap-2 shadow-lg">
                            <i class="fa-solid fa-download"></i> Download Enhanced
                        </button>
                        
                        <!-- Send to Tool -->
                        <app-send-to-tool *ngIf="enhancedImage"
                            [hasOutput]="!!enhancedImage"
                            [currentRoute]="currentRoute"
                            [outputData]="enhancedImage"
                            [fileName]="getOutputFileName()"
                            [fileType]="'image'">
                        </app-send-to-tool>
                        
                        <button (click)="reset()" 
                                class="px-6 py-3 justify-center align-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
                            <i class="fa-solid fa-rotate"></i> Try Another
                        </button>
                    </div>
                </div>

                <!-- Info Section -->
                <div class="mt-8 grid md:grid-cols-3 gap-4">
                    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
                        <i class="fa-solid fa-expand text-purple-500 text-2xl mb-2"></i>
                        <h4 class="font-bold text-gray-800 dark:text-white">4x Upscale</h4>
                        <p class="text-gray-500 text-sm">Increase resolution up to 4 times</p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
                        <i class="fa-solid fa-eye text-purple-500 text-2xl mb-2"></i>
                        <h4 class="font-bold text-gray-800 dark:text-white">Deblur</h4>
                        <p class="text-gray-500 text-sm">Remove blur and sharpen details</p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
                        <i class="fa-solid fa-robot text-purple-500 text-2xl mb-2"></i>
                        <h4 class="font-bold text-gray-800 dark:text-white">AI Powered</h4>
                        <p class="text-gray-500 text-sm">Real-ESRGAN neural network</p>
                    </div>
                </div>

                <!-- SEO Content -->
                <article class="prose lg:prose-xl mx-auto mt-16 px-4 max-w-4xl">
                    <h1 class="text-3xl font-bold text-gray-900 mb-6">AI Image Enhancer - Upscale & Deblur Photos Free</h1>
                    <p class="text-gray-600 mb-8 leading-relaxed">
                        Enhance blurry images and upscale photos with AI-powered Real-ESRGAN technology. 
                        Restore old photos, improve low-resolution images, and sharpen details instantly.
                    </p>

                    <h2 class="text-2xl font-bold text-gray-800 mb-4">How to Enhance Images?</h2>
                    <ol class="list-decimal pl-6 mb-8 space-y-2 text-gray-600">
                        <li><strong>Upload Image:</strong> Drag and drop or click to browse.</li>
                        <li><strong>Enhance:</strong> Click the enhance button to start AI processing.</li>
                        <li><strong>Compare:</strong> View original vs enhanced side by side.</li>
                        <li><strong>Download:</strong> Save your enhanced high-resolution image.</li>
                    </ol>

                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Why Use AI Enhancement?</h2>
                    <ul class="list-disc pl-6 mb-8 space-y-2 text-gray-600">
                        <li><strong>4x Upscale:</strong> Increase resolution up to 4 times.</li>
                        <li><strong>Deblur:</strong> Remove blur and sharpen details.</li>
                        <li><strong>Photo Restoration:</strong> Restore old or damaged photos.</li>
                        <li><strong>AI Powered:</strong> Uses Real-ESRGAN neural network.</li>
                    </ul>

                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                    <div class="space-y-4">
                        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h3 class="font-bold text-gray-900 mb-2">How long does enhancement take?</h3>
                            <p class="text-gray-600">Usually 30-60 seconds depending on image size and server load.</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h3 class="font-bold text-gray-900 mb-2">What image formats are supported?</h3>
                            <p class="text-gray-600">JPG, PNG, and WebP formats are fully supported.</p>
                        </div>
                    </div>
                </article>

            </div>
        </div>
    </div>
  `
})
export class ImageEnhancerComponent implements OnInit {
    originalImage: string | null = null;
    enhancedImage: string | null = null;
    originalFileName = '';
    isProcessing = false;
    error = '';
    currentRoute = '/image/enhance';

    private apiUrl = environment.apiUrl;
    private workspaceService: WorkspaceService;

    constructor(
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone,
        workspaceService: WorkspaceService,
        private analyticsService: AnalyticsService,
        private seoService: SeoService
    ) {
        this.workspaceService = workspaceService;
    }

    ngOnInit(): void {
        this.seoService.updateSeo({
            title: 'AI Image Enhancer - Upscale & Restore Photos',
            description: 'Enhance image quality with AI. Upscale low-resolution photos, unblur images, and restore old photos instantly for free.',
            keywords: 'image enhancer, ai image upscaler, photo restoration, unblur image, improve photo quality, online photo enhancer',
            url: 'https://2olhub.netlify.app/image/enhance'
        });

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
        return this.originalFileName.replace(/\.[^/.]+$/, '') + '_enhanced.png';
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
        this.enhancedImage = null;
        this.error = '';

        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.originalImage = e.target.result;
            this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
    }

    async enhanceImage() {
        if (!this.originalImage) return;

        this.isProcessing = true;
        this.error = '';
        this.cdr.detectChanges();

        try {
            const response = await fetch(`${this.apiUrl}/enhance/image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image: this.originalImage
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Enhancement failed');
            }

            this.ngZone.run(() => {
                this.enhancedImage = result.enhanced;
                this.isProcessing = false;
                this.analyticsService.trackToolUsage('image-enhancer', 'AI Image Enhancer', 'image');
                this.cdr.detectChanges();
            });

        } catch (error: any) {
            console.error('Enhancement error:', error);
            this.ngZone.run(() => {
                this.error = error.message || 'Failed to enhance image';
                this.isProcessing = false;
                this.cdr.detectChanges();
            });
        }
    }

    downloadEnhanced() {
        if (!this.enhancedImage) return;

        // Convert base64 to blob
        const base64Data = this.enhancedImage.replace(/^data:image\/\w+;base64,/, '');
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });

        const fileName = this.originalFileName.replace(/\.[^/.]+$/, '') + '_enhanced.png';
        saveAs(blob, fileName);
    }

    reset() {
        this.originalImage = null;
        this.enhancedImage = null;
        this.originalFileName = '';
        this.error = '';
    }
}
