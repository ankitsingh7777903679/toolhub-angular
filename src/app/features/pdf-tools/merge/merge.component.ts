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
    selector: 'app-merge',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    template: `
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <div class="py-12 text-center" style="background-color: #FFEDD5;">
            <div class="w-16 h-16 bg-white/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-object-group text-3xl" style="color: #F97316;"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Merge PDF</h1>
            <p class="text-gray-600">Combine multiple PDF files into one document</p>
        </div>

        <div class="container mx-auto px-4 py-8">
            <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
                
                <!-- Upload Area (hide when result ready) -->
                <div *ngIf="!resultReady" class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 hover:bg-orange-50 transition-colors cursor-pointer mb-8"
                     (click)="fileInput.click()" 
                     (dragover)="onDragOver($event)" 
                     (drop)="onDrop($event)">
                    <input #fileInput type="file" multiple accept=".pdf" (change)="onFileSelect($event)" class="hidden">
                    <i class="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-3"></i>
                    <p class="text-gray-600 font-medium">Click to upload PDF files</p>
                    <p class="text-gray-400 text-sm mt-1">or drag and drop multiple files</p>
                </div>

                <!-- File List (hide when result ready) -->
                <div *ngIf="files.length > 0 && !resultReady" class="space-y-3 mb-8">
                    <h3 class="font-bold text-gray-800 mb-4">Selected Files ({{files.length}})</h3>
                    <div *ngFor="let file of files; let i = index" class="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 group hover:border-orange-200 transition-colors">
                        <div class="flex items-center gap-3 overflow-hidden">
                            <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-500 shrink-0">
                                <span class="font-bold text-xs">PDF</span>
                            </div>
                            <span class="text-gray-700 truncate font-medium max-w-[200px]">{{ file.name }}</span>
                            <span class="text-xs text-gray-400">({{ (file.size / 1024 / 1024).toFixed(2) }} MB)</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <button (click)="moveUp(i)" *ngIf="i > 0" class="p-2 text-gray-400 hover:text-orange-500 transition-colors" title="Move Up">
                                <i class="fa-solid fa-arrow-up"></i>
                            </button>
                            <button (click)="moveDown(i)" *ngIf="i < files.length - 1" class="p-2 text-gray-400 hover:text-orange-500 transition-colors" title="Move Down">
                                <i class="fa-solid fa-arrow-down"></i>
                            </button>
                            <button (click)="removeFile(i)" class="p-2 text-red-400 hover:text-red-600 transition-colors ml-2" title="Remove">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons (hide when result ready) -->
                <div class="flex gap-4" *ngIf="files.length > 0 && !resultReady">
                    <button (click)="clearAll()" class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                        Clear All
                    </button>
                    <button (click)="mergePdfs()" [disabled]="isProcessing || files.length < 2" 
                            class="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-200">
                        <span *ngIf="isProcessing"><i class="fa-solid fa-spinner fa-spin"></i> Processing...</span>
                        <span *ngIf="!isProcessing">Merge {{ files.length }} PDFs</span>
                    </button>
                </div>

                <!-- Empty State Message -->
                <div *ngIf="files.length < 2 && files.length > 0 && !resultReady" class="mt-4 text-center text-amber-600 text-sm bg-amber-50 p-2 rounded-lg">
                    <i class="fa-solid fa-circle-info mr-1"></i> Please select at least 2 PDF files to merge.
                </div>

                <!-- Result Section -->
                <div *ngIf="resultReady" class="bg-orange-50 border border-orange-200 rounded-xl p-6">
                    <div class="text-center mb-4">
                        <i class="fa-solid fa-circle-check text-orange-500 text-4xl mb-2"></i>
                        <h3 class="font-bold text-orange-800 text-lg">PDFs Merged!</h3>
                        <p class="text-orange-600 text-sm">{{ mergedFileCount }} files combined into one PDF</p>
                    </div>
                    
                    <div class="flex flex-col md:flex-row gap-3">
                        <button (click)="downloadResult()" 
                                class="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-200">
                            <i class="fa-solid fa-download"></i> Download PDF
                        </button>
                        
                        <!-- Send to Tool -->
                        <app-send-to-tool 
                            [hasOutput]="!!pdfDataUrl"
                            [currentRoute]="'/pdf/merge'"
                            [outputData]="pdfDataUrl"
                            [fileName]="getOutputFileName()"
                            [fileType]="'pdf'">
                        </app-send-to-tool>
                    </div>

                    <div class="flex gap-4 mt-4 justify-center">
                        <button (click)="reset()" class="text-orange-600 hover:text-orange-800 font-medium text-sm">
                            <i class="fa-solid fa-plus mr-1"></i> Merge More PDFs
                        </button>
                    </div>
                </div>

                </div>
            </div>

            <!-- SEO Content -->
            <article class="prose lg:prose-xl mx-auto mt-16 px-4 max-w-4xl">
                <h2 class="text-3xl font-bold text-gray-900 mb-6">Merge PDF Files Online for Free</h2>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    Got a bunch of PDFs that need to be one file? Maybe it's a contract split across three documents, or a handful of report sections your team sent over separately. Whatever the case, this tool lets you combine them into a single PDF in a few clicks. Drop your files in, drag them into the right order, and hit merge.
                </p>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    Everything runs in your browser using a library called pdf-lib — your files never leave your device. That matters if you're dealing with sensitive stuff like legal documents or financial records. There's no upload, no server processing, and no one else sees your data.
                </p>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">What Can You Merge?</h2>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    Pretty much any standard PDF. Contracts, invoices, reports, scanned pages, cover letters — if it opens in a PDF reader, you can merge it here. The tool keeps all the original formatting intact: fonts, images, bookmarks, everything. One thing to note: password-protected PDFs need to be unlocked first. You can use the Unlock tool on this site to handle that, then come back and merge.
                </p>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">Real-World Uses</h2>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    Lawyers combine contracts with amendments and signature pages into one bundle. Students put together research papers, notes, and reference material for studying. Accountants merge invoices and receipts for end-of-month filing. Real estate agents package property listings with disclosures and inspection reports. It's one of those tools you don't think about until you need it — and then you really need it.
                </p>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                <div class="space-y-4">
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Is it safe to merge PDFs here?</h3>
                        <p class="text-gray-600">Yes — the merging happens entirely in your browser. Your documents don't get uploaded to a server. The pdf-lib library handles everything locally, so there's zero risk to your data.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Does it work on my phone?</h3>
                        <p class="text-gray-600">It does. The tool is fully responsive, so you can upload and merge PDFs from Safari on an iPhone, Chrome on Android, or any mobile browser. It works the same way as on desktop.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">How many files can I merge at once?</h3>
                        <p class="text-gray-600">There's no hard limit. Since it runs in your browser, it depends on how much memory your device has. For most people, merging a dozen or so files works without any issues. Very large batches (hundreds of pages) might slow things down on older machines.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">What about encrypted PDFs?</h3>
                        <p class="text-gray-600">You'll need to unlock them first. Password-protected files can't be read by the merge tool. Use the Unlock PDF tool on this site to remove the password, then come back and merge.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Will the merged PDF look different from the originals?</h3>
                        <p class="text-gray-600">No. Merging just stitches the original pages together — there's no re-encoding or compression involved. Text, images, fonts, and layout stay exactly the same.</p>
                    </div>
                </div>
            </article>
        </div>
  `
})
export class MergeComponent implements OnInit {
    files: File[] = [];
    isProcessing = false;

    resultReady = false;
    pdfBlob: Blob | null = null;
    pdfDataUrl = '';
    mergedFileCount = 0;

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
            title: 'Merge PDF',
            description: 'Combine multiple PDF files into one document instantly. Fast, secure, and free online PDF merger.',
            keywords: 'merge pdf, combine pdf, join pdfs, online pdf merger, free pdf tool',
            url: 'https://2olhub.netlify.app/pdf/merge'
        });
        this.seoService.setFaqJsonLd([
            { question: 'Is it safe to merge PDFs here?', answer: 'Yes — the merging happens entirely in your browser. Your documents don\'t get uploaded to a server. The pdf-lib library handles everything locally, so there\'s zero risk to your data.' },
            { question: 'Does it work on my phone?', answer: 'It does. The tool is fully responsive, so you can upload and merge PDFs from Safari on an iPhone, Chrome on Android, or any mobile browser.' },
            { question: 'How many files can I merge at once?', answer: 'There\'s no hard limit. Since it runs in your browser, it depends on how much memory your device has. For most people, merging a dozen or so files works without any issues.' },
            { question: 'What about encrypted PDFs?', answer: 'You\'ll need to unlock them first. Password-protected files can\'t be read by the merge tool. Use the Unlock PDF tool on this site to remove the password.' },
            { question: 'Will the merged PDF look different from the originals?', answer: 'No. Merging just stitches the original pages together — there\'s no re-encoding or compression involved. Text, images, fonts, and layout stay exactly the same.' }
        ]);

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
                const pdfFile = new File([blob], fileName, { type: 'application/pdf' });
                this.files = [pdfFile];
                this.cdr.detectChanges();
            });
    }

    getOutputFileName(): string {
        return `merged_${new Date().getTime()}.pdf`;
    }

    onFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.addFiles(Array.from(input.files));
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
        if (event.dataTransfer?.files) {
            this.addFiles(Array.from(event.dataTransfer.files));
        }
    }

    addFiles(newFiles: File[]) {
        const pdfFiles = newFiles.filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
        this.files = [...this.files, ...pdfFiles];
    }

    removeFile(index: number) {
        this.files.splice(index, 1);
    }

    moveUp(index: number) {
        if (index > 0) {
            [this.files[index], this.files[index - 1]] = [this.files[index - 1], this.files[index]];
        }
    }

    moveDown(index: number) {
        if (index < this.files.length - 1) {
            [this.files[index], this.files[index + 1]] = [this.files[index + 1], this.files[index]];
        }
    }

    clearAll() {
        this.files = [];
    }

    async mergePdfs() {
        if (this.files.length < 2) return;

        this.isProcessing = true;
        this.cdr.detectChanges();

        try {
            const { PDFDocument } = PDFLib;
            const mergedPdf = await PDFDocument.create();

            for (const file of this.files) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page: any) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            this.pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
            this.mergedFileCount = this.files.length;

            // Generate data URL for Tool Chain
            const reader = new FileReader();
            reader.onloadend = () => {
                this.ngZone.run(() => {
                    this.pdfDataUrl = reader.result as string;
                    this.resultReady = true;
                    this.isProcessing = false;
                    this.analyticsService.trackToolUsage('pdf-merge', 'Merge PDF', 'pdf');
                    this.cdr.detectChanges();
                });
            };
            reader.readAsDataURL(this.pdfBlob);

        } catch (error) {
            console.error('Error merging PDFs:', error);
            this.ngZone.run(() => {
                this.isProcessing = false;
                this.cdr.detectChanges();
                alert('Failed to merge PDFs. Please try again.');
            });
        }
    }

    downloadResult() {
        if (this.pdfBlob) {
            saveAs(this.pdfBlob, this.getOutputFileName());
        }
    }

    reset() {
        this.files = [];
        this.resultReady = false;
        this.pdfBlob = null;
        this.pdfDataUrl = '';
        this.mergedFileCount = 0;
    }
}
