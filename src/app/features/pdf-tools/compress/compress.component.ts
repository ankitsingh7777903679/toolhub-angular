import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { ScriptLoaderService } from '../../../core/services/script-loader.service';

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
                                <p class="text-gray-700 font-medium">{{ file.name }}</p>
                                <p class="text-xs text-gray-400">Original: {{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
                            </div>
                        </div>
                        <button (click)="file = null" class="text-red-400 hover:text-red-600">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>

                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Compression Level</label>
                        <select [(ngModel)]="compressionLevel" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                            <option value="low">Low (Better Quality)</option>
                            <option value="medium">Medium (Balanced)</option>
                            <option value="high">High (Smaller Size)</option>
                        </select>
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
                        <p class="text-green-600 text-sm">Reduced from {{ originalSize }} to {{ compressedSize }}</p>
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
    </div>
  `
})
export class CompressComponent implements OnInit {
    file: File | null = null;
    isProcessing = false;
    compressionLevel = 'medium';

    resultReady = false;
    pdfBlob: Blob | null = null;
    pdfDataUrl = '';
    originalSize = '';
    compressedSize = '';

    constructor(
        private cdr: ChangeDetectorRef,
        private workspaceService: WorkspaceService,
        private scriptLoader: ScriptLoaderService
    ) { }

    async ngOnInit(): Promise<void> {
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
                this.cdr.detectChanges();
            });
    }

    getOutputFileName(): string {
        return this.file ? `compressed_${this.file.name}` : 'compressed.pdf';
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

    async compressPdf() {
        if (!this.file) return;
        this.isProcessing = true;
        this.originalSize = (this.file.size / 1024 / 1024).toFixed(2) + ' MB';

        try {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

            const arrayBuffer = await this.file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            const { PDFDocument } = PDFLib;
            const newPdf = await PDFDocument.create();

            let quality = 0.5;
            if (this.compressionLevel === 'low') quality = 0.8;
            if (this.compressionLevel === 'high') quality = 0.3;

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                const ctx = canvas.getContext('2d');
                await page.render({ canvasContext: ctx, viewport }).promise;

                const imgDataUrl = canvas.toDataURL('image/jpeg', quality);
                const jpgImage = await newPdf.embedJpg(imgDataUrl);
                const pageDims = jpgImage.scale(1 / 1.5);

                const newPage = newPdf.addPage([pageDims.width, pageDims.height]);
                newPage.drawImage(jpgImage, {
                    x: 0, y: 0,
                    width: pageDims.width, height: pageDims.height,
                });
            }

            const pdfBytes = await newPdf.save();
            this.pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
            this.compressedSize = (this.pdfBlob.size / 1024 / 1024).toFixed(2) + ' MB';

            // Generate data URL for Tool Chain
            const reader = new FileReader();
            reader.onloadend = () => {
                this.pdfDataUrl = reader.result as string;
                this.cdr.detectChanges();
            };
            reader.readAsDataURL(this.pdfBlob);

            this.resultReady = true;
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
        this.resultReady = false;
        this.pdfBlob = null;
        this.pdfDataUrl = '';
        this.originalSize = '';
        this.compressedSize = '';
    }
}
