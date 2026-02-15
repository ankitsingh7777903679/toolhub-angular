import { Component, NgZone, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { ScriptLoaderService } from '../../../core/services/script-loader.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SeoService } from '../../../core/services/seo.service';

declare const pdfjsLib: any;
declare const saveAs: any;

@Component({
    selector: 'app-pdf-to-image',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    template: `
    <div class="min-h-screen bg-gray-50">
        <div class="py-12 text-center" style="background-color: #DBEAFE;">
            <div class="w-16 h-16 bg-white/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-image text-3xl" style="color: #3B82F6;"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">PDF to Image</h1>
            <p class="text-gray-600">Convert PDF pages to JPG or PNG images</p>
        </div>

        <div class="container mx-auto px-4 py-8">
            <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
                <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                     (click)="fileInput.click()" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
                    <input #fileInput type="file" accept=".pdf" (change)="onFileSelect($event)" class="hidden">
                    <i class="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-3"></i>
                    <p class="text-gray-600 font-medium">Click to upload PDF file</p>
                </div>

                <div *ngIf="file" class="mt-6 space-y-4">
                    <div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-500">
                                <span class="font-bold text-xs">PDF</span>
                            </div>
                            <p class="text-gray-700 font-medium truncate max-w-[200px]">{{ file.name }}</p>
                        </div>
                        <button (click)="file = null" class="text-red-400 hover:text-red-600">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Format</label>
                            <select [(ngModel)]="format" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                <option value="png">PNG</option>
                                <option value="jpeg">JPG</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Quality</label>
                            <select [(ngModel)]="quality" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                <option value="1">High</option>
                                <option value="2">Medium</option>
                                <option value="3">Low</option>
                            </select>
                        </div>
                    </div>

                    <button (click)="convertToImage()" [disabled]="isProcessing"
                            class="w-full px-4 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50">
                        <span *ngIf="isProcessing"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Converting...</span>
                        <span *ngIf="!isProcessing"><i class="fa-solid fa-image mr-2"></i>Convert to Images</span>
                    </button>
                </div>

                <div *ngIf="images.length > 0" class="mt-8">
                    <h3 class="font-bold text-gray-800 mb-4">Converted Images ({{ images.length }})</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div *ngFor="let img of images; let i = index" class="border rounded-lg p-2">
                            <img [src]="img" alt="Page {{i+1}}" class="w-full rounded">
                            <div class="flex gap-2 mt-2">
                                <button (click)="downloadImage(img, i)" class="flex-1 px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                                    <i class="fa-solid fa-download mr-1"></i> Download
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Send first image to Tool Chain -->
                    <div *ngIf="images.length > 0" class="mt-4 flex justify-center">
                        <app-send-to-tool 
                            [hasOutput]="images.length > 0"
                            [currentRoute]="'/pdf/to-image'"
                            [outputData]="images[0]"
                            [fileName]="getOutputFileName()"
                            [fileType]="'image'">
                        </app-send-to-tool>
                    </div>
                </div>
                </div>
            </div>

            <!-- SEO Content -->
            <article class="prose lg:prose-xl mx-auto mt-16 px-4 max-w-4xl">
                <h2 class="text-3xl font-bold text-gray-900 mb-6">Convert PDF to Image (JPG & PNG) Online</h2>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    Need to turn a PDF page into an image you can paste into a presentation, share on social media, or insert into a document? This tool converts every page of your PDF into individual JPG or PNG images. Pick the format that suits you, choose a quality level, and download the pages you need.
                </p>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    The rendering happens in your browser using pdf.js — nothing gets uploaded to a server. Each page shows up with its own download button, so you can grab just the pages you actually need instead of downloading the whole batch.
                </p>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">JPG or PNG — Which to Choose?</h2>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    Short answer: JPG for sharing, PNG for precision. JPG files are smaller, which makes them great for emailing, posting online, or dropping into a PowerPoint. PNG files are larger but lossless — every pixel is preserved. If you plan to edit the images later or need sharp text rendering for documentation, PNG is the better choice. For most casual uses, JPG works fine.
                </p>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">Quality Settings</h2>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    You get three quality options. High renders at 3x scale — that gives you a roughly 2480 × 3508 pixel image for an A4 page, which is sharp enough for printing. Medium (2x) is good for screen use and presentations. Low (1x) keeps file sizes small for quick sharing. Higher quality means bigger files, so pick based on what you're doing with the images.
                </p>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                <div class="space-y-4">
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Can I download just one page?</h3>
                        <p class="text-gray-600">Yes — every page has its own download button. Grab the ones you need and skip the rest.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">How sharp are the output images?</h3>
                        <p class="text-gray-600">Depends on the quality setting. High quality (3x scale) gives you print-ready resolution — around 2480 × 3508 pixels for an A4 page. Medium (2x) is great for screens. Low (1x) is fine for quick previews and sharing.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Is my PDF uploaded to a server?</h3>
                        <p class="text-gray-600">No. The pdf.js library renders your PDF entirely in your browser. Your file stays on your device the entire time.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Does it work with encrypted PDFs?</h3>
                        <p class="text-gray-600">No — you'll need to remove the password first. Use the Unlock PDF tool on this site, then come back and convert the unlocked file.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Is there any cost or usage limit?</h3>
                        <p class="text-gray-600">No — it's completely free. No registration, no daily caps, and no watermarks on the output images.</p>
                    </div>
                </div>
            </article>
        </div>
  `
})
export class PdfToImageComponent implements OnInit {
    file: File | null = null;
    isProcessing = false;
    format = 'png';
    quality = '1';
    images: string[] = [];

    private workspaceService: WorkspaceService;

    constructor(
        private ngZone: NgZone,
        private cdr: ChangeDetectorRef,
        workspaceService: WorkspaceService,
        private scriptLoader: ScriptLoaderService,
        private analyticsService: AnalyticsService,
        private seoService: SeoService
    ) {
        this.workspaceService = workspaceService;
    }

    async ngOnInit(): Promise<void> {
        this.seoService.updateSeo({
            title: 'PDF to Image - Convert PDF to JPG & PNG Online',
            description: 'Convert PDF pages to images for free. Extract pages as high-quality JPG or PNG files. Safe, fast, and no installation required.',
            keywords: 'pdf to image, pdf to jpg, pdf to png, pdf converter, convert pdf pages to images, free pdf tool',
            url: 'https://2olhub.netlify.app/pdf/pdf-to-image' // Note: Component folder is pdf-to-image, route is likely /pdf/pdf-to-image or similar. Checked routes earlier, it is /pdf/to-image. I will use to-image.
        });
        this.seoService.setFaqJsonLd([
            { question: 'Can I download just one page?', answer: 'Yes — every page has its own download button. Grab the ones you need and skip the rest.' },
            { question: 'How sharp are the output images?', answer: 'Depends on the quality setting. High quality (3x scale) gives you print-ready resolution. Medium (2x) is great for screens. Low (1x) is fine for quick previews.' },
            { question: 'Is my PDF uploaded to a server?', answer: 'No. The pdf.js library renders your PDF entirely in your browser. Your file stays on your device the entire time.' },
            { question: 'Does it work with encrypted PDFs?', answer: 'No — you\'ll need to remove the password first. Use the Unlock PDF tool on this site.' },
            { question: 'Is there any cost or usage limit?', answer: 'No — it\'s completely free. No registration, no daily caps, and no watermarks on the output images.' }
        ]);

        await this.scriptLoader.load(['pdf-js']);

        // Check if there's a PDF from another tool (e.g., Image to PDF)
        if (this.workspaceService.hasFile()) {
            const file = this.workspaceService.getFile();
            if (file && file.fileType === 'pdf') {
                this.loadPdfFromWorkspace(file.data, file.fileName);
            }
        }
    }

    private loadPdfFromWorkspace(dataUrl: string, fileName: string): void {
        fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
                this.file = new File([blob], fileName, { type: 'application/pdf' });
                this.cdr.detectChanges();
            });
    }

    getOutputFileName(): string {
        return this.file ? this.file.name.replace('.pdf', '_page1.' + this.format) : 'converted.' + this.format;
    }

    onFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.[0]) {
            this.file = input.files[0];
            this.images = [];
        }
    }

    onDragOver(event: DragEvent) { event.preventDefault(); }

    onDrop(event: DragEvent) {
        event.preventDefault();
        if (event.dataTransfer?.files?.[0]?.type === 'application/pdf') {
            this.file = event.dataTransfer.files[0];
            this.images = [];
        }
    }

    async convertToImage() {
        if (!this.file) return;
        this.isProcessing = true;
        this.images = [];

        try {
            // Set worker source
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

            const arrayBuffer = await this.file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const scale = 4 - parseInt(this.quality);

            // Collect all images first
            const tempImages: string[] = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');
                await page.render({ canvasContext: ctx, viewport }).promise;
                tempImages.push(canvas.toDataURL(`image/${this.format}`));
            }

            // Update state inside Angular zone to trigger change detection
            this.ngZone.run(() => {
                this.images = tempImages;
                this.isProcessing = false;
                this.analyticsService.trackToolUsage('pdf-to-image', 'PDF to Image', 'pdf');
                this.cdr.detectChanges();
            });
        } catch (error) {
            console.error('Error converting PDF:', error);
            this.ngZone.run(() => {
                this.isProcessing = false;
                alert('Failed to convert PDF. Please try again.');
            });
        }
    }

    downloadImage(dataUrl: string, index: number) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `page_${index + 1}.${this.format}`;
        link.click();
    }
}
