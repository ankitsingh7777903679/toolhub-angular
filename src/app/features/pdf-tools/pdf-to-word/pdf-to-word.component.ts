import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ScriptLoaderService } from '../../../core/services/script-loader.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SeoService } from '../../../core/services/seo.service';

declare const pdfjsLib: any;
declare const saveAs: any;

@Component({
    selector: 'app-pdf-to-word',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="min-h-screen bg-gray-50">
        <div class="py-12 text-center" style="background-color: #DBEAFE;">
            <div class="w-16 h-16 bg-white/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-eye text-3xl" style="color: #2563EB;"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">PDF OCR</h1>
            <p class="text-gray-600">Extract text from scanned PDF using AI OCR</p>
        </div>

        <div class="container mx-auto px-4 py-8">
            <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
                <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                     (click)="fileInput.click()" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
                    <input #fileInput type="file" accept=".pdf" (change)="onFileSelect($event)" class="hidden">
                    <i class="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-3"></i>
                    <p class="text-gray-600 font-medium">Click to upload PDF file</p>
                    <p class="text-gray-400 text-sm mt-1">Works with scanned books and image PDFs</p>
                </div>

                <div *ngIf="file" class="mt-6 space-y-4">
                    <div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-500">
                                <span class="font-bold text-xs">PDF</span>
                            </div>
                            <p class="text-gray-700 font-medium truncate max-w-[200px]">{{ file.name }}</p>
                        </div>
                        <button (click)="clearFile()" class="text-red-400 hover:text-red-600">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>

                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p class="text-blue-800 text-sm">
                            <i class="fa-solid fa-robot mr-2"></i>
                            Using AI OCR (Llama 4 Scout) to extract text from images
                        </p>
                    </div>

                    <button (click)="extractText()" [disabled]="isProcessing"
                            class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
                        <span *ngIf="isProcessing"><i class="fa-solid fa-spinner fa-spin mr-2"></i>{{ status }}</span>
                        <span *ngIf="!isProcessing"><i class="fa-solid fa-file-lines mr-2"></i>Extract Text</span>
                    </button>
                </div>

                <!-- Progress Section -->
                <div *ngIf="isProcessing" class="mt-6">
                    <div class="bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div class="bg-blue-500 h-full transition-all duration-300" [style.width.%]="progress"></div>
                    </div>
                    <p class="text-center text-gray-600 text-sm mt-2">{{ status }}</p>
                </div>

                <!-- Result Section -->
                <div *ngIf="extractedText && !isProcessing" class="mt-8">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-bold text-gray-800">
                            <i class="fa-solid fa-check-circle text-green-500 mr-2"></i>
                            Extracted Text ({{ pageCount }} pages)
                        </h3>
                        <button (click)="copyText()" class="text-blue-600 hover:text-blue-800 text-sm">
                            <i class="fa-solid fa-copy mr-1"></i>Copy
                        </button>
                    </div>
                    
                    <div class="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto mb-4">
                        <div class="text-sm text-gray-700 font-sans ocr-preview" [innerHTML]="extractedText"></div>
                    </div>

                    <p class="text-sm text-gray-600 mb-3 text-center">Download as:</p>
                    <div class="grid grid-cols-3 gap-3">
                        <button (click)="downloadText()" [disabled]="isDownloading"
                                class="px-4 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors disabled:opacity-50">
                            <i class="fa-solid fa-file-lines mr-2"></i>TXT
                        </button>
                        <button (click)="downloadWord()" [disabled]="isDownloading"
                                class="px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
                            <i class="fa-solid fa-file-word mr-2"></i>Word
                        </button>
                        <button (click)="downloadPdf()" [disabled]="isDownloading"
                                class="px-4 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50">
                            <span *ngIf="isDownloading"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Generating...</span>
                            <span *ngIf="!isDownloading"><i class="fa-solid fa-file-pdf mr-2"></i>PDF</span>
                        </button>
                    </div>
                </div>

                <!-- Error Section -->
                <div *ngIf="error" class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p class="text-red-800 text-sm">
                        <i class="fa-solid fa-circle-exclamation mr-2"></i>
                        {{ error }}
                    </p>
                </div>
                </div>
            </div>

            <!-- SEO Content -->
            <article class="prose lg:prose-xl mx-auto mt-16 px-4 max-w-4xl">
                <h1 class="text-3xl font-bold text-gray-900 mb-6">PDF OCR - Extract Text from Scanned PDF Online</h1>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    Convert scanned PDF documents and images into editable text formats. 
                    Our AI-powered OCR tool recognizes text from images and scanned pages with high accuracy.
                </p>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">How to Extract Text from PDF?</h2>
                <ol class="list-decimal pl-6 mb-8 space-y-2 text-gray-600">
                    <li><strong>Upload File:</strong> Select your scanned PDF or image containing text.</li>
                    <li><strong>Process:</strong> Our AI engine analyzes the document and identifies character patterns.</li>
                    <li><strong>Review:</strong> See the extracted text on the screen instantly.</li>
                    <li><strong>Download:</strong> Save the result as a TXT or Word file.</li>
                </ol>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">Why use this OCR Tool?</h2>
                <ul class="list-disc pl-6 mb-8 space-y-2 text-gray-600">
                    <li><strong>AI Accuracy:</strong> Uses advanced machine learning (Llama 4 Scout) for superior text recognition.</li>
                    <li><strong>Multi-Language Support:</strong> Capable of recognizing text in various languages.</li>
                    <li><strong>Editable Output:</strong> Convert unreadable scans into fully editable Word documents.</li>
                    <li><strong>100% Free:</strong> No subscription required for basic OCR tasks.</li>
                </ul>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                <div class="space-y-4">
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Can it read handwriting?</h3>
                        <p class="text-gray-600">It performs best with printed text, but clear handwriting can sometimes be recognized depending on quality.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Are my documents stored?</h3>
                        <p class="text-gray-600">No, files are processed temporarily and are not permanently stored on our servers.</p>
                    </div>
                </div>
            </article>
        </div>
    
    
  `
})
export class PdfToWordComponent {
    file: File | null = null;
    isProcessing = false;
    status = '';
    progress = 0;
    extractedText = '';
    error = '';
    pageCount = 0;
    isDownloading = false;

    private apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private ngZone: NgZone,
        private cdr: ChangeDetectorRef,
        private scriptLoader: ScriptLoaderService,
        private analyticsService: AnalyticsService,
        private seoService: SeoService
    ) { }

    async ngOnInit(): Promise<void> {
        this.seoService.updateSeo({
            title: 'PDF OCR - Extract Text from Scanned PDF Online',
            description: 'Extract text from scanned PDF files and images using free online OCR. Convert scanned documents to editable Word or Text files. AI-powered text recognition.',
            keywords: 'pdf ocr, extract text from pdf, scanned pdf to text, image to text, online ocr, free ocr tool',
            url: 'https://2olhub.netlify.app/pdf/pdf-to-word'
        });

        await this.scriptLoader.load(['pdf-js', 'file-saver']);
    }

    onFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.[0]) {
            this.file = input.files[0];
            this.extractedText = '';
            this.error = '';
        }
    }

    onDragOver(event: DragEvent) { event.preventDefault(); }

    onDrop(event: DragEvent) {
        event.preventDefault();
        if (event.dataTransfer?.files?.[0]?.type === 'application/pdf') {
            this.file = event.dataTransfer.files[0];
            this.extractedText = '';
            this.error = '';
        }
    }

    clearFile() {
        this.file = null;
        this.extractedText = '';
        this.error = '';
    }

    async extractText() {
        if (!this.file) return;

        this.isProcessing = true;
        this.status = 'Loading PDF...';
        this.progress = 5;
        this.error = '';
        this.extractedText = '';
        this.cdr.detectChanges();


        try {
            // Load PDF.js library
            await this.scriptLoader.load(['pdf-js']);
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

            // Load PDF
            const arrayBuffer = await this.file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            this.pageCount = pdf.numPages;

            this.status = `Processing ${pdf.numPages} page(s)...`;
            this.progress = 10;
            this.cdr.detectChanges();

            // Process each page
            const allHtml: string[] = [];
            const scale = 1.5;  // Good balance of quality vs size

            for (let i = 1; i <= pdf.numPages; i++) {
                this.status = `OCR Page ${i}/${pdf.numPages}...`;
                this.progress = 10 + (i / pdf.numPages) * 80;
                this.cdr.detectChanges();

                // Render page to canvas
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');
                await page.render({ canvasContext: ctx, viewport }).promise;

                // Compress to JPEG (60% quality for smaller size + good OCR)
                const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
                const base64 = dataUrl.split(',')[1];

                console.log(`📄 Page ${i}: ${Math.round(base64.length / 1024)}KB`);

                // Send to OCR API
                try {
                    const response = await this.http.post<{ success: boolean; text: string; html: string }>(
                        `${this.apiUrl}/ocr/extract-single`,
                        { base64, mimeType: 'image/jpeg', returnHtml: true }
                    ).toPromise();

                    if (response?.success && (response.html || response.text)) {
                        allHtml.push(`<!-- Page ${i} -->\n${response.html || response.text}`);
                    }
                } catch (ocrError: any) {
                    console.error(`OCR failed for page ${i}:`, ocrError);
                    allHtml.push(`<!-- Page ${i} -->\n<p style="color:red;">OCR failed for this page</p>`);
                }

                // Small delay between pages to avoid rate limiting
                if (i < pdf.numPages) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            }

            this.ngZone.run(() => {
                this.extractedText = allHtml.join('\n\n<hr style="margin:20px 0;border:1px dashed #ccc;"/>\n\n');
                this.status = 'Complete!';
                this.progress = 100;
                this.isProcessing = false;
                this.analyticsService.trackToolUsage('pdf-to-word', 'PDF OCR', 'pdf');
                this.cdr.detectChanges();
            });

        } catch (error: any) {
            console.error('Error extracting text:', error);
            this.ngZone.run(() => {
                this.error = error.error?.message || error.message || 'Failed to extract text. Please try again.';
                this.isProcessing = false;
                this.progress = 0;
                this.cdr.detectChanges();
            });
        }
    }

    private fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result.split(',')[1]);
            };
            reader.onerror = error => reject(error);
        });
    }

    // Strip HTML tags and convert to plain text
    private stripHtml(html: string): string {
        const div = document.createElement('div');
        div.innerHTML = html;
        // Replace br and block elements with newlines
        div.querySelectorAll('br, p, div, h1, h2, h3, h4, h5, h6, li').forEach(el => {
            el.insertAdjacentText('beforebegin', '\n');
        });
        return div.textContent?.trim() || html;
    }

    copyText() {
        if (this.extractedText) {
            const plainText = this.stripHtml(this.extractedText);
            navigator.clipboard.writeText(plainText);
        }
    }

    downloadText() {
        if (!this.extractedText) return;

        const plainText = this.stripHtml(this.extractedText);
        const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
        const fileName = this.file?.name.replace('.pdf', '.txt') || 'extracted-text.txt';
        saveAs(blob, fileName);
    }

    async downloadWord() {
        if (!this.extractedText) return;

        // Dynamic import to avoid build issues
        const { Document, Packer, Paragraph, TextRun } = await import('docx');

        // Strip HTML and create paragraphs
        const plainText = this.stripHtml(this.extractedText);
        const paragraphs = plainText.split('\n').map(line =>
            new Paragraph({
                children: [new TextRun(line)]
            })
        );

        const doc = new Document({
            sections: [{
                properties: {},
                children: paragraphs
            }]
        });

        const blob = await Packer.toBlob(doc);
        const fileName = this.file?.name.replace('.pdf', '.docx') || 'extracted-text.docx';
        saveAs(blob, fileName);
    }

    async downloadPdf() {
        if (!this.extractedText || this.isDownloading) return;

        this.isDownloading = true;
        this.cdr.detectChanges();
        const fileName = this.file?.name.replace('.pdf', '-extracted.pdf') || 'extracted-text.pdf';

        try {
            // Call backend API to generate PDF with proper Hindi/Gujarati font support
            const response = await fetch(`${this.apiUrl}/pdf/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: this.extractedText,
                    filename: fileName
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate PDF');
            }

            // Download the PDF
            const blob = await response.blob();
            saveAs(blob, fileName);

        } catch (error: any) {
            console.error('PDF generation error:', error);
            alert('Failed to generate PDF: ' + error.message);
        } finally {
            this.ngZone.run(() => {
                this.isDownloading = false;
                this.cdr.detectChanges();
            });
        }
    }
}

