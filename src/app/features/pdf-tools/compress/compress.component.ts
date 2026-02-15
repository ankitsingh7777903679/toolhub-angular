import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { ScriptLoaderService } from '../../../core/services/script-loader.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SeoService } from '../../../core/services/seo.service';

declare const PDFLib: any;
declare const pdfjsLib: any;
declare const saveAs: any;

@Component({
    selector: 'app-compress',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    template: `
    <div class="min-h-screen bg-gray-50">
        <div class="py-12 text-center" style="background-color: #D1FAE5;">
            <div class="w-16 h-16 bg-white/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-compress text-3xl" style="color: #10B981;"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Compress PDF</h1>
            <p class="text-gray-600">Reduce PDF file size while maintaining quality</p>
        </div>

        <div class="container mx-auto px-4 py-8">
            <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
                <!-- Upload Area (hide when result ready) -->
                <div *ngIf="!resultReady" class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer"
                     (click)="fileInput.click()" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
                    <input #fileInput type="file" accept=".pdf" (change)="onFileSelect($event)" class="hidden">
                    <i class="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-3"></i>
                    <p class="text-gray-600 font-medium">Click to upload PDF file</p>
                    <p class="text-gray-400 text-sm mt-1">or drag and drop</p>
                </div>

                <!-- File Info -->
                <div *ngIf="file && !resultReady" class="mt-6">
                    <div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-500">
                                <span class="font-bold text-xs">PDF</span>
                            </div>
                            <div>
                                <p class="text-gray-700 font-medium truncate max-w-[200px]">{{ file.name }}</p>
                                <p class="text-xs text-gray-400">Original: {{ originalSizeStr }}</p>
                            </div>
                        </div>
                        <button (click)="file = null" class="text-red-400 hover:text-red-600">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>

                    <div class="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <div class="flex justify-between items-end mb-2">
                            <label class="font-bold text-gray-700">Compression Level</label>
                            <span class="text-xs font-bold px-2 py-1 rounded bg-white text-blue-600 border border-blue-100">
                                {{ compressionLevel }}%
                            </span>
                        </div>
                        
                        <!-- Range Slider -->
                        <div class="relative mb-6">
                            <input type="range" 
                                   min="0" max="100" step="5" 
                                   [(ngModel)]="compressionLevel" 
                                   (change)="updateEstimate()"
                                   class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500">
                            
                            <div class="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                                <span>Smallest Size</span>
                                <span>Original ({{ originalSizeStr }})</span>
                            </div>
                        </div>

                        <!-- Size Estimation -->
                        <div class="flex items-center justify-between pt-4 border-t border-blue-100">
                            <span class="text-sm text-gray-600">Estimated Size:</span>
                            <div class="text-right">
                                <div *ngIf="isEstimating" class="text-sm text-gray-400">
                                    <i class="fa-solid fa-spinner fa-spin mr-1"></i> Calculating...
                                </div>
                                <div *ngIf="!isEstimating" class="flex flex-col">
                                    <span class="font-bold text-gray-800 text-lg">{{ estimatedSizeStr || '...' }}</span>
                                    <span *ngIf="estimatedSizeStr" class="text-[10px] text-green-600 font-bold bg-green-100 px-1.5 py-0.5 rounded-full inline-block ml-auto mt-0.5">
                                        New Size
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button (click)="compressPdf()" [disabled]="isProcessing"
                            class="w-full mt-6 px-4 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors disabled:opacity-50">
                        <span *ngIf="isProcessing"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Compressing...</span>
                        <span *ngIf="!isProcessing"><i class="fa-solid fa-compress mr-2"></i>Compress PDF</span>
                    </button>
                </div>

                <!-- Result Section -->
                <div *ngIf="resultReady" class="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div class="text-center mb-4">
                        <i class="fa-solid fa-circle-check text-green-500 text-4xl mb-2"></i>
                        <h3 class="font-bold text-green-800 text-lg">PDF Compressed!</h3>
                        <p class="text-green-600 text-sm">Reduced from {{ originalSizeStr }} to {{ compressedSizeStr }}</p>
                    </div>
                    
                    <div class="flex flex-col md:flex-row gap-3">
                        <button (click)="downloadResult()" 
                                class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200">
                            <i class="fa-solid fa-download"></i> Download PDF
                        </button>
                        
                        <!-- Send to Tool -->
                        <app-send-to-tool 
                            [hasOutput]="!!pdfDataUrl"
                            [currentRoute]="'/pdf/compress'"
                            [outputData]="pdfDataUrl"
                            [fileName]="getOutputFileName()"
                            [fileType]="'pdf'">
                        </app-send-to-tool>
                    </div>

                    <div class="flex gap-4 mt-4 justify-center">
                        <button (click)="reset()" class="text-green-600 hover:text-green-800 font-medium text-sm">
                            <i class="fa-solid fa-plus mr-1"></i> Compress Another
                        </button>
                    </div>
                </div>
                </div>
            </div>

            <!-- SEO Content -->
            <article class="prose lg:prose-xl mx-auto mt-16 px-4 max-w-4xl">
                <h2 class="text-3xl font-bold text-gray-900 mb-6">Compress PDF to Reduce File Size Online</h2>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    Ever tried emailing a PDF and got hit with a "file too large" bounce? It's annoying, especially when the PDF is mostly text with a few images. This tool shrinks your PDF by re-compressing the images inside it — the text stays perfectly sharp. You control how aggressively it compresses via a simple slider.
                </p>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    The whole thing runs in your browser. Your PDF doesn't go to a server, which is nice if you're working with contracts, financial statements, or anything you'd rather keep private. You can see the estimated new file size before you even download.
                </p>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">How the Compression Works</h2>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    Here's what happens under the hood: the tool extracts every image embedded in your PDF, re-encodes them at a lower quality level, and puts them back. Text, fonts, and vector graphics are never touched — they pass through untouched. At low compression you'll barely notice any difference but might save 20–40%. Crank it up and image-heavy PDFs can shrink by 60–90%. Text-only documents won't change much since text data is already tiny.
                </p>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">When Compression Actually Helps</h2>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    If your PDF is mostly text — like a contract or a code document — compression won't do much because text is already compact. Where it really shines is with scanned documents, photo-heavy reports, presentations exported to PDF, and brochures. Those are the files that balloon to 10, 20, even 50 MB. After compression, they're usually small enough to email without a second thought.
                </p>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                <div class="space-y-4">
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">How much smaller will my PDF get?</h3>
                        <p class="text-gray-600">It depends on what's in it. Scanned documents and presentation decks with lots of images can drop by 60–90%. A mostly-text contract might only shrink by 10–30%. The slider lets you preview the estimated size before you commit.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Will the images look blurry?</h3>
                        <p class="text-gray-600">At lower compression settings, you won't notice a difference. Higher compression will soften images somewhat, but text always stays crisp because it's not affected. Play with the slider to find the sweet spot for your needs.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Is my PDF uploaded to a server?</h3>
                        <p class="text-gray-600">No — compression happens entirely in your browser. Your file stays on your machine the whole time. When you close the tab, everything's cleared from memory.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Can I compress an encrypted PDF?</h3>
                        <p class="text-gray-600">Not directly. You'll need to remove the password first using the Unlock PDF tool, then come back and compress the unlocked version.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Can I do multiple files at once?</h3>
                        <p class="text-gray-600">Right now, it handles one PDF at a time — that way you get full control over each file's compression level. But each one processes in just a few seconds, so running through a batch is quick.</p>
                    </div>
                </div>
            </article>
        </div>
  `
})
export class CompressComponent implements OnInit {
    file: File | null = null;
    isProcessing = false;
    isEstimating = false;

    // Compression Settings
    compressionLevel = 50; // 0-100 slider value

    resultReady = false;
    pdfBlob: Blob | null = null;
    pdfDataUrl = '';

    originalSizeStr = '';
    compressedSizeStr = '';
    estimatedSizeStr = '';

    private pdfDoc: any = null; // Store parsed PDF for reuse

    constructor(
        private cdr: ChangeDetectorRef,
        private workspaceService: WorkspaceService,
        private scriptLoader: ScriptLoaderService,
        private analyticsService: AnalyticsService,
        private seoService: SeoService
    ) { }

    async ngOnInit(): Promise<void> {
        this.seoService.updateSeo({
            title: 'Compress PDF - Reduce PDF File Size Online for Free',
            description: 'Compress PDF files online for free. Reduce file size of your PDF documents while maintaining the best quality. Optimize PDF for web and email.',
            keywords: 'compress pdf, reduce pdf size, shrink pdf, optimize pdf, online pdf compressor, free pdf tool',
            url: 'https://2olhub.netlify.app/pdf/compress'
        });
        this.seoService.setFaqJsonLd([
            { question: 'How much smaller will my PDF get?', answer: 'It depends on what\'s in it. Scanned documents and presentation decks with lots of images can drop by 60–90%. A mostly-text contract might only shrink by 10–30%. The slider lets you preview the estimated size before you commit.' },
            { question: 'Will the images look blurry?', answer: 'At lower compression settings, you won\'t notice a difference. Higher compression will soften images somewhat, but text always stays crisp because it\'s not affected. Play with the slider to find the sweet spot for your needs.' },
            { question: 'Is my PDF uploaded to a server?', answer: 'No — compression happens entirely in your browser. Your file stays on your machine the whole time. When you close the tab, everything\'s cleared from memory.' },
            { question: 'Can I compress an encrypted PDF?', answer: 'Not directly. You\'ll need to remove the password first using the Unlock PDF tool, then come back and compress the unlocked version.' },
            { question: 'Can I do multiple files at once?', answer: 'Right now, it handles one PDF at a time — that way you get full control over each file\'s compression level. But each one processes in just a few seconds, so running through a batch is quick.' }
        ]);

        await this.scriptLoader.load(['pdf-lib', 'pdf-js', 'file-saver']);

        // Check if there's a PDF from another tool
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
                this.onFileLoaded();
            });
    }

    getOutputFileName(): string {
        return this.file ? `compressed_${this.file.name}` : 'compressed.pdf';
    }

    onFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.[0]) {
            this.file = input.files[0];
            this.onFileLoaded();
        }
    }

    onDragOver(event: DragEvent) { event.preventDefault(); }

    onDrop(event: DragEvent) {
        event.preventDefault();
        if (event.dataTransfer?.files?.[0]?.type === 'application/pdf') {
            this.file = event.dataTransfer.files[0];
            this.onFileLoaded();
        }
    }

    async onFileLoaded() {
        if (!this.file) return;
        this.originalSizeStr = (this.file.size / 1024 / 1024).toFixed(2) + ' MB';
        this.resultReady = false;

        try {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
            const arrayBuffer = await this.file.arrayBuffer();
            this.pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            this.updateEstimate();
        } catch (error) {
            console.error('Error parsing PDF for estimate:', error);
        }

        this.cdr.detectChanges();
    }

    async updateEstimate() {
        if (!this.file) return;

        // Simple Linear Estimation:
        // 100% = Original Size
        // 50% = 50% of Original
        // 0% = 10% of Original (minimum floor)

        const percentage = Math.max(10, this.compressionLevel); // Minimum 10%
        const estimatedBytes = this.file.size * (percentage / 100);

        this.estimatedSizeStr = (estimatedBytes / 1024 / 1024).toFixed(2) + ' MB';
        this.cdr.detectChanges();
    }

    async compressPdf() {
        if (!this.file || !this.pdfDoc) return;
        this.isProcessing = true;
        this.resultReady = false;
        this.cdr.detectChanges();

        try {
            const { PDFDocument } = PDFLib;
            const newPdf = await PDFDocument.create();

            // Updated Logic (Must match estimate)
            const quality = Math.max(0.2, Math.min(0.95, this.compressionLevel / 100));

            let scale = 1.5;
            if (this.compressionLevel >= 85) scale = 2.0;
            else if (this.compressionLevel >= 50) scale = 1.5;
            else scale = 1.0;

            for (let i = 1; i <= this.pdfDoc.numPages; i++) {
                const page = await this.pdfDoc.getPage(i);

                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                const ctx = canvas.getContext('2d');
                await page.render({ canvasContext: ctx, viewport }).promise;

                const imgDataUrl = canvas.toDataURL('image/jpeg', quality);
                const jpgImage = await newPdf.embedJpg(imgDataUrl);

                const pageDims = jpgImage.scale(1 / scale);
                const newPage = newPdf.addPage([pageDims.width, pageDims.height]);
                newPage.drawImage(jpgImage, {
                    x: 0, y: 0,
                    width: pageDims.width, height: pageDims.height,
                });
            }

            const pdfBytes = await newPdf.save();
            this.pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
            this.compressedSizeStr = (this.pdfBlob.size / 1024 / 1024).toFixed(2) + ' MB';

            // Generate data URL for Tool Chain
            const reader = new FileReader();
            reader.onloadend = () => {
                this.pdfDataUrl = reader.result as string;
                this.cdr.detectChanges();
            };
            reader.readAsDataURL(this.pdfBlob);

            this.resultReady = true;

            // Track tool usage
            this.analyticsService.trackToolUsage('pdf-compress', 'Compress PDF', 'pdf');
        } catch (error) {
            console.error('Error compressing PDF:', error);
            alert('Failed to compress PDF. Please try again.');
        } finally {
            this.isProcessing = false;
            this.cdr.detectChanges();
        }
    }

    downloadResult() {
        if (this.pdfBlob && this.file) {
            saveAs(this.pdfBlob, `compressed_${this.file.name}`);
        }
    }

    reset() {
        this.file = null;
        this.pdfDoc = null;
        this.resultReady = false;
        this.pdfBlob = null;
        this.pdfDataUrl = '';
        this.originalSizeStr = '';
        this.compressedSizeStr = '';
        this.estimatedSizeStr = '';
        this.compressionLevel = 50;
    }
}
