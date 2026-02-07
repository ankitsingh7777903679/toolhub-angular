import { Component, ChangeDetectorRef, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { ScriptLoaderService } from '../../../core/services/script-loader.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SeoService } from '../../../core/services/seo.service';

declare const PDFLib: any;
declare const saveAs: any;

@Component({
    selector: 'app-watermark',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    template: `
    <div class="min-h-screen bg-gray-50">
        <div class="py-12 text-center" style="background-color: #E0F2FE;">
            <div class="w-16 h-16 bg-white/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-droplet text-3xl" style="color: #0EA5E9;"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Add Watermark</h1>
            <p class="text-gray-600">Add text or image watermark to PDF</p>
        </div>

        <div class="container mx-auto px-4 py-8">
            <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
                <!-- Upload Area (hide when result ready) -->
                <div *ngIf="!resultReady" class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-sky-500 hover:bg-sky-50 transition-colors cursor-pointer"
                     (click)="fileInput.click()" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
                    <input #fileInput type="file" accept=".pdf" (change)="onFileSelect($event)" class="hidden">
                    <i class="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-3"></i>
                    <p class="text-gray-600 font-medium">Click to upload PDF file</p>
                    <p class="text-gray-400 text-sm mt-1">or drag and drop</p>
                </div>

                <!-- File Info (hide when result ready) -->
                <div *ngIf="file && !resultReady" class="mt-6 space-y-4">
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

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Watermark Text</label>
                        <input type="text" [(ngModel)]="watermarkText" placeholder="Enter watermark text..."
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Opacity</label>
                            <select [(ngModel)]="opacity" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                <option value="0.1">10%</option>
                                <option value="0.2">20%</option>
                                <option value="0.3">30%</option>
                                <option value="0.5">50%</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                            <select [(ngModel)]="fontSize" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                <option value="24">Small</option>
                                <option value="48">Medium</option>
                                <option value="72">Large</option>
                            </select>
                        </div>
                    </div>

                    <button (click)="addWatermark()" [disabled]="isProcessing || !watermarkText"
                            class="w-full px-4 py-3 bg-sky-500 text-white rounded-lg font-bold hover:bg-sky-600 transition-colors disabled:opacity-50">
                        <span *ngIf="isProcessing"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Adding...</span>
                        <span *ngIf="!isProcessing"><i class="fa-solid fa-droplet mr-2"></i>Add Watermark</span>
                    </button>
                </div>

                <!-- Result Section -->
                <div *ngIf="resultReady" class="bg-sky-50 border border-sky-200 rounded-xl p-6">
                    <div class="text-center mb-4">
                        <i class="fa-solid fa-circle-check text-sky-500 text-4xl mb-2"></i>
                        <h3 class="font-bold text-sky-800 text-lg">Watermark Added!</h3>
                        <p class="text-sky-600 text-sm">Your PDF now has a watermark</p>
                    </div>
                    
                    <div class="flex flex-col md:flex-row gap-3">
                        <button (click)="downloadResult()" 
                                class="flex-1 px-6 py-3 bg-sky-500 text-white rounded-lg font-bold hover:bg-sky-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-sky-200">
                            <i class="fa-solid fa-download"></i> Download PDF
                        </button>
                        
                        <!-- Send to Tool -->
                        <app-send-to-tool 
                            [hasOutput]="!!pdfDataUrl"
                            [currentRoute]="'/pdf/watermark'"
                            [outputData]="pdfDataUrl"
                            [fileName]="getOutputFileName()"
                            [fileType]="'pdf'">
                        </app-send-to-tool>
                    </div>

                    <div class="flex gap-4 mt-4 justify-center">
                        <button (click)="reset()" class="text-sky-600 hover:text-sky-800 font-medium text-sm">
                            <i class="fa-solid fa-plus mr-1"></i> Add Another Watermark
                        </button>
                    </div>
                </div>
                </div>
            </div>

            <!-- SEO Content -->
            <article class="prose lg:prose-xl mx-auto mt-16 px-4 max-w-4xl">
                <h1 class="text-3xl font-bold text-gray-900 mb-6">Add Watermark to PDF Files Online</h1>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    Secure your intellectual property or brand your documents by adding a watermark. 
                    Insert custom text or images onto every page of your PDF file instantly and for free.
                </p>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">How to Watermark a PDF?</h2>
                <ol class="list-decimal pl-6 mb-8 space-y-2 text-gray-600">
                    <li><strong>Upload PDF:</strong> Select the file you want to protect.</li>
                    <li><strong>Customize:</strong> Enter your watermark text (e.g., "CONFIDENTIAL").</li>
                    <li><strong>Adjust:</strong> Set the font size and opacity level to your liking.</li>
                    <li><strong>Apply:</strong> Click "Add Watermark" to imprint your text on every page.</li>
                    <li><strong>Download:</strong> Save your watermarked document.</li>
                </ol>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">Why Watermark?</h2>
                <ul class="list-disc pl-6 mb-8 space-y-2 text-gray-600">
                    <li><strong>Copyright Protection:</strong> clearly ownership of your work.</li>
                    <li><strong>Status Indication:</strong> Mark documents as "DRAFT", "APPROVED", or "SAMPLE".</li>
                    <li><strong>Branding:</strong> Add your company name to all outgoing documents.</li>
                    <li><strong>Free & Fast:</strong> No software installation needed.</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                <div class="space-y-4">
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Can I remove the watermark later?</h3>
                        <p class="text-gray-600">Watermarks added here are permanent parts of the PDF. Keep your original file safe if you need a non-watermarked version.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Can I use an image logo?</h3>
                        <p class="text-gray-600">Currently, we support text watermarks. Image watermark support is coming soon!</p>
                    </div>
                </div>
            </article>
        </div>
  `
})
export class WatermarkComponent implements OnInit {
    file: File | null = null;
    isProcessing = false;
    watermarkText = '';
    opacity = '0.2';
    fontSize = '48';

    resultReady = false;
    pdfBlob: Blob | null = null;
    pdfDataUrl = '';

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
            title: 'Watermark PDF - Add Text Watermark to PDF Online',
            description: 'Add watermark to PDF files online for free. Insert text watermarks to your documents. Adjust transparency, font size, and position.',
            keywords: 'watermark pdf, add watermark, pdf watermark online, stamp pdf, protect pdf copyright, free pdf tool',
            url: 'https://2olhub.netlify.app/pdf/watermark'
        });

        await this.scriptLoader.load(['pdf-lib', 'file-saver']);

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
                this.cdr.detectChanges();
            });
    }

    getOutputFileName(): string {
        return this.file ? `watermarked_${this.file.name}` : 'watermarked.pdf';
    }

    onFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.[0]) this.file = input.files[0];
    }

    onDragOver(event: DragEvent) { event.preventDefault(); }

    onDrop(event: DragEvent) {
        event.preventDefault();
        if (event.dataTransfer?.files?.[0]?.type === 'application/pdf') {
            this.file = event.dataTransfer.files[0];
        }
    }

    async addWatermark() {
        if (!this.file || !this.watermarkText) return;
        this.isProcessing = true;
        this.cdr.detectChanges();

        try {
            const arrayBuffer = await this.file.arrayBuffer();
            const { PDFDocument, rgb, StandardFonts } = PDFLib;
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const pages = pdfDoc.getPages();
            const opacity = parseFloat(this.opacity);
            const size = parseInt(this.fontSize);

            pages.forEach((page: any) => {
                const { width, height } = page.getSize();
                const textWidth = helveticaFont.widthOfTextAtSize(this.watermarkText, size);
                const x = (width / 2) - (textWidth / 2);
                const y = height / 2;

                page.drawText(this.watermarkText, {
                    x: x,
                    y: y,
                    size: size,
                    font: helveticaFont,
                    color: rgb(0.5, 0.5, 0.5),
                    opacity: opacity,
                    rotate: { type: 'degrees', angle: -45 } as any
                });
            });

            const pdfBytes = await pdfDoc.save();
            this.pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

            // Generate data URL for Tool Chain
            const reader = new FileReader();
            reader.onloadend = () => {
                this.ngZone.run(() => {
                    this.pdfDataUrl = reader.result as string;
                    this.resultReady = true;
                    this.isProcessing = false;
                    this.analyticsService.trackToolUsage('pdf-watermark', 'Watermark PDF', 'pdf');
                    this.cdr.detectChanges();
                });
            };
            reader.readAsDataURL(this.pdfBlob);

        } catch (error) {
            console.error('Error adding watermark:', error);
            this.ngZone.run(() => {
                this.isProcessing = false;
                this.cdr.detectChanges();
                alert('Failed to add watermark. Please try again.');
            });
        }
    }

    downloadResult() {
        if (this.pdfBlob && this.file) {
            saveAs(this.pdfBlob, `watermarked_${this.file.name}`);
        }
    }

    reset() {
        this.file = null;
        this.resultReady = false;
        this.pdfBlob = null;
        this.pdfDataUrl = '';
        this.watermarkText = '';
    }
}
