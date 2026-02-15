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
                    <h2 class="text-3xl font-bold text-gray-900 mb-6">AI Image Enhancer — Bring Blurry Photos Back to Life</h2>
                    <p class="text-gray-600 mb-8 leading-relaxed">
                        We've all got that one photo — taken in bad lighting, zoomed in too far, or downloaded as a tiny thumbnail that looked fine on a phone but falls apart on a bigger screen. Regular upscaling just stretches the pixels and makes things look worse. This tool does something fundamentally different: it uses a neural network (Real-ESRGAN) to actually reconstruct detail that isn't there anymore.
                    </p>
                    <p class="text-gray-600 mb-8 leading-relaxed">
                        The AI was trained on millions of image pairs — low-res and high-res versions of the same content — so it's learned how to fill in textures, sharpen edges, and clean up noise in ways that look natural. Upload a blurry vacation photo, a grainy screenshot, or a faded family picture, and you'll typically see a noticeable improvement. It won't create detail that was never captured, but it's remarkably good at pulling out detail that was hidden by blur, noise, or low resolution.
                    </p>

                    <h2 class="text-2xl font-bold text-gray-800 mb-4">What It's Good At (And What It's Not)</h2>
                    <p class="text-gray-600 mb-8 leading-relaxed">
                        The enhancer works best on photos that are blurry, low-resolution, noisy, or faded. It can push a 500×500 image up to 2000×2000 while keeping it sharp — try doing that with normal scaling and you'll see the difference immediately. It's also great at cleaning up JPEG compression artifacts, the kind of blocky weirdness you see in heavily compressed web images. Where it won't help much is photos that are completely out of focus or severely motion-blurred. There's a limit to what any AI can reconstruct from very little data.
                    </p>

                    <h2 class="text-2xl font-bold text-gray-800 mb-4">How it Works</h2>
                    <p class="text-gray-600 mb-8 leading-relaxed">
                        Upload your image, hit Enhance, and wait about 30–60 seconds. The image gets sent to our AI server for processing (this one can't run in-browser — the model is too large). Once it's done, you'll see the original and enhanced versions side by side so you can compare. If it looks good, download the enhanced version as a high-quality PNG. Your image is processed in memory and deleted immediately after — nothing is stored.
                    </p>

                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                    <div class="space-y-4">
                        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h3 class="font-bold text-gray-900 mb-2">Why does it take 30–60 seconds?</h3>
                            <p class="text-gray-600">The AI model is doing heavy computation — analyzing every region of your image and reconstructing detail pixel by pixel. Larger images naturally take longer since there's more data to process. It's not instant, but the results are worth the wait.</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h3 class="font-bold text-gray-900 mb-2">Can this fix a completely out-of-focus photo?</h3>
                            <p class="text-gray-600">It depends on how severe the blur is. Mild softness and camera shake get improved significantly. Heavy defocus blur — where the subject is just a shapeless blob — is harder. The AI can sharpen it somewhat, but it can't invent detail that was never captured by the camera.</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h3 class="font-bold text-gray-900 mb-2">Is this good for restoring old family photos?</h3>
                            <p class="text-gray-600">Yes — that's actually one of its strongest use cases. Old scanned photos that are faded, grainy, or low-resolution tend to respond really well to enhancement. The AI fills in detail, reduces grain, and improves overall sharpness noticeably.</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h3 class="font-bold text-gray-900 mb-2">What formats can I upload?</h3>
                            <p class="text-gray-600">JPG, PNG, and WebP. The enhanced image always downloads as a PNG to preserve maximum quality from the enhancement process.</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h3 class="font-bold text-gray-900 mb-2">Is my image stored on your server?</h3>
                            <p class="text-gray-600">No. The image is sent to our AI server for processing, but it's handled entirely in memory and deleted as soon as the enhanced version is returned to you. Nothing is stored permanently.</p>
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
        this.seoService.setFaqJsonLd([
            { question: 'Why does it take 30–60 seconds?', answer: 'The AI model analyzes every region of your image and reconstructs detail pixel by pixel. Larger images take longer since there\'s more data to process.' },
            { question: 'Can this fix a completely out-of-focus photo?', answer: 'Mild softness and camera shake get improved significantly. Heavy defocus blur is harder — the AI can sharpen somewhat, but can\'t invent detail that was never captured.' },
            { question: 'Is this good for restoring old family photos?', answer: 'Yes — old scanned photos that are faded, grainy, or low-resolution respond really well to enhancement.' },
            { question: 'What formats can I upload?', answer: 'JPG, PNG, and WebP. The enhanced image always downloads as a PNG to preserve maximum quality.' },
            { question: 'Is my image stored on your server?', answer: 'No. The image is sent for processing but handled entirely in memory and deleted as soon as the enhanced version is returned.' }
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
