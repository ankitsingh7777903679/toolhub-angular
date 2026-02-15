import { Component, ChangeDetectorRef, NgZone, OnInit } from '@angular/core';
import { SeoService } from '../../../core/services/seo.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';

@Component({
    selector: 'app-word-to-pdf',
    standalone: true,
    imports: [CommonModule, SendToToolComponent],
    template: `
    <div class="min-h-screen bg-gray-50">
        <div class="py-12 text-center" style="background-color: #FEE2E2;">
            <div class="w-16 h-16 bg-white/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-file-pdf text-3xl" style="color: #DC2626;"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Word to PDF</h1>
            <p class="text-gray-600">Convert Word documents to PDF format</p>
        </div>

        <div class="container mx-auto px-4 py-8">
            <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
                <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                     (click)="fileInput.click()" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
                    <input #fileInput type="file" accept=".doc,.docx" (change)="onFileSelect($event)" class="hidden">
                    <i class="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-3"></i>
                    <p class="text-gray-600 font-medium">Click to upload Word document</p>
                    <p class="text-gray-400 text-sm mt-1">.doc or .docx files</p>
                </div>

                <div *ngIf="file" class="mt-6 space-y-4">
                    <div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                <i class="fa-solid fa-file-word"></i>
                            </div>
                            <div>
                                <p class="text-gray-700 font-medium truncate max-w-[200px]">{{ file.name }}</p>
                                <p class="text-gray-400 text-xs">{{ formatFileSize(file.size) }}</p>
                            </div>
                        </div>
                        <button (click)="removeFile()" class="text-red-400 hover:text-red-600">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>

                    <!-- Convert Button (only show if not yet converted) -->
                    <button *ngIf="!conversionComplete" (click)="convertToPdf()" [disabled]="isProcessing"
                            class="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                        <span *ngIf="isProcessing"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Converting...</span>
                        <span *ngIf="!isProcessing"><i class="fa-solid fa-file-pdf mr-2"></i>Convert to PDF</span>
                    </button>
                </div>

                <!-- Success: Download & Tool Chaining -->
                <div *ngIf="conversionComplete && pdfBlob" class="mt-6 space-y-4">
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p class="text-green-700 text-sm mb-3">
                            <i class="fa-solid fa-circle-check mr-2"></i>
                            {{ successMessage }}
                        </p>
                        
                        <div class="flex flex-col md:flex-row gap-3 ">
                            <button (click)="downloadPdf()" 
                                    class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                                <i class="fa-solid fa-download"></i>
                                Download PDF
                            </button>
                            
                            <app-send-to-tool
                                [hasOutput]="conversionComplete"
                                [currentRoute]="'/pdf/word-to-pdf'"
                                [outputData]="pdfDataUrl"
                                [fileName]="outputFileName"
                                [fileType]="'pdf'">
                            </app-send-to-tool>
                        </div>
                    </div>
                    
                    <!-- Convert Another -->
                    <button (click)="resetAll()" 
                            class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        <i class="fa-solid fa-rotate-left mr-2"></i>
                        Convert Another File
                    </button>
                </div>

                <!-- Error Message -->
                <div *ngIf="errorMessage" class="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p class="text-red-700 text-sm">
                        <i class="fa-solid fa-circle-exclamation mr-2"></i>
                        {{ errorMessage }}
                    </p>
                </div>
            </div>

            <!-- SEO Content -->
            <article class="prose lg:prose-xl mx-auto mt-16 px-4 max-w-4xl">
                <h2 class="text-3xl font-bold text-gray-900 mb-6">Word to PDF — Convert .doc and .docx Files</h2>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    Need to send a Word document but don't want the recipient to accidentally mess up the formatting — or worse, see all your Track Changes? Convert it to PDF first. Upload your .doc or .docx file, and the converter handles everything: tables, images, headers, footers, footnotes. The PDF comes out looking exactly like the original.
                </p>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    PDFs look the same on every device, every operating system, and every screen size. That's why they're the standard for resumes, invoices, contracts, and anything you want the recipient to see exactly as you designed it. No more "it looked fine on my computer" conversations.
                </p>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">Formatting Accuracy</h2>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    The conversion engine handles complex documents well — multi-column layouts, tables with merged cells, embedded charts, text boxes, and styled headings all come through. Standard fonts like Arial, Calibri, and Times New Roman render perfectly. Custom or rare fonts are closely matched. For best results, stick to common fonts in your Word files.
                </p>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">After Conversion</h2>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    Once the PDF is ready, download it directly or send it to another tool — merge it with other PDFs, compress it for email, add a password, or stamp a watermark. The tool chain lets you do all of that without re-uploading.
                </p>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                <div class="space-y-4">
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Does it support .doc (older Word format)?</h3>
                        <p class="text-gray-600">Yes — both legacy .doc files (Word 97-2003) and modern .docx files (Office 2007+, including Office 365) are supported.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Are my fonts preserved?</h3>
                        <p class="text-gray-600">Standard fonts like Arial, Calibri, and Times New Roman are embedded in the PDF. Unusual or custom fonts are substituted with the closest available match. For the most accurate output, use widely-available fonts.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Is my document stored on the server?</h3>
                        <p class="text-gray-600">No — your file is processed in memory, converted, and returned to your browser. It's deleted immediately after conversion. We don't keep copies.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Can I handle large files with lots of images?</h3>
                        <p class="text-gray-600">Yes. Documents with embedded images, charts, and tables convert without issues. Very large files (50+ MB) may take a few extra seconds but will complete successfully.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Can I convert the PDF back to Word?</h3>
                        <p class="text-gray-600">You can use the PDF OCR tool to extract text from a PDF and save it as a Word document. But it's always best to keep your original .docx as the source of truth.</p>
                    </div>
                </div>
            </article>
        </div>
  `
})
export class WordToPdfComponent implements OnInit {
    file: File | null = null;
    isProcessing = false;
    errorMessage = '';
    successMessage = '';

    // Tool chaining state
    conversionComplete = false;
    pdfBlob: Blob | null = null;
    pdfDataUrl = '';
    outputFileName = '';

    private apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone,
        private seoService: SeoService
    ) { }

    ngOnInit(): void {
        this.seoService.updateSeo({
            title: 'Word to PDF - Convert Doc & Docx to PDF Online',
            description: 'Convert Word documents to PDF online for free. accurate DOC and DOCX to PDF conversion. Keep your formatting intact.',
            keywords: 'word to pdf, doc to pdf, docx to pdf, convert word to pdf, microsoft word to pdf, office to pdf',
            url: 'https://2olhub.netlify.app/pdf/word-to-pdf'
        });
        this.seoService.setFaqJsonLd([
            { question: 'Does it support .doc (older Word format)?', answer: 'Yes — both legacy .doc files (Word 97-2003) and modern .docx files are supported.' },
            { question: 'Are my fonts preserved?', answer: 'Standard fonts like Arial, Calibri, and Times New Roman are embedded. Unusual fonts are substituted with the closest match.' },
            { question: 'Is my document stored on the server?', answer: 'No — your file is processed in memory, converted, and returned to your browser. It\'s deleted immediately after conversion.' },
            { question: 'Can I handle large files with lots of images?', answer: 'Yes. Documents with embedded images, charts, and tables convert without issues. Very large files may take a few extra seconds.' },
            { question: 'Can I convert the PDF back to Word?', answer: 'You can use the PDF OCR tool to extract text from a PDF and save it as a Word document. But it\'s best to keep your original .docx as the source of truth.' }
        ]);
    }

    onFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.[0]) {
            this.file = input.files[0];
            this.resetState();
        }
    }

    onDragOver(event: DragEvent) { event.preventDefault(); }

    onDrop(event: DragEvent) {
        event.preventDefault();
        const file = event.dataTransfer?.files?.[0];
        if (file && (file.name.endsWith('.doc') || file.name.endsWith('.docx'))) {
            this.file = file;
            this.resetState();
        }
    }

    removeFile() {
        this.file = null;
        this.resetState();
    }

    resetState() {
        this.errorMessage = '';
        this.successMessage = '';
        this.conversionComplete = false;
        this.pdfBlob = null;
        this.pdfDataUrl = '';
        this.outputFileName = '';
    }

    resetAll() {
        this.file = null;
        this.resetState();
    }

    formatFileSize(bytes: number): string {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    convertToPdf() {
        if (!this.file) return;

        this.isProcessing = true;
        this.errorMessage = '';

        const formData = new FormData();
        formData.append('file', this.file);

        this.http.post(`${this.apiUrl}/pdf/word-to-pdf`, formData, {
            responseType: 'blob',
            observe: 'response'
        }).subscribe({
            next: async (response) => {
                this.ngZone.run(async () => {
                    try {
                        if (response?.body) {
                            // Check if response is actually an error (JSON in blob)
                            if (response.body.type === 'application/json') {
                                const text = await response.body.text();
                                const error = JSON.parse(text);
                                this.errorMessage = error.message || 'Conversion failed';
                                this.isProcessing = false;
                                this.cdr.detectChanges();
                                return;
                            }

                            // Store blob for download
                            this.pdfBlob = response.body;

                            // Get filename
                            const contentDisposition = response.headers.get('Content-Disposition');
                            this.outputFileName = this.file!.name.replace(/\.(doc|docx)$/i, '.pdf');

                            if (contentDisposition) {
                                const match = contentDisposition.match(/filename="(.+)"/);
                                if (match) this.outputFileName = match[1];
                            }

                            // Convert to data URL for tool chaining
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                this.ngZone.run(() => {
                                    this.pdfDataUrl = reader.result as string;
                                    this.successMessage = `Successfully converted to ${this.outputFileName}`;
                                    this.conversionComplete = true;
                                    this.isProcessing = false;

                                    // User will click Download button manually
                                    this.cdr.detectChanges();
                                });
                            };
                            reader.readAsDataURL(this.pdfBlob);
                        }
                    } catch (err) {
                        console.error('Error processing response:', err);
                        this.errorMessage = 'Error processing response';
                        this.isProcessing = false;
                        this.cdr.detectChanges();
                    }
                });
            },
            error: async (error) => {
                this.ngZone.run(async () => {
                    console.error('Error converting document:', error);

                    if (error?.error instanceof Blob) {
                        try {
                            const text = await error.error.text();
                            const parsed = JSON.parse(text);
                            this.errorMessage = parsed.message || 'Conversion failed';
                        } catch {
                            this.errorMessage = 'Failed to convert document. Please try again.';
                        }
                    } else {
                        this.errorMessage = error?.message || 'Failed to convert document. Please try again.';
                    }

                    this.isProcessing = false;
                    this.cdr.detectChanges();
                });
            }
        });
    }

    downloadPdf() {
        if (!this.pdfBlob) return;

        const url = window.URL.createObjectURL(this.pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.outputFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}
