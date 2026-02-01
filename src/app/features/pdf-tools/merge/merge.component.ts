import { Component, ChangeDetectorRef, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { ScriptLoaderService } from '../../../core/services/script-loader.service';

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
                            <span class="text-gray-700 truncate font-medium">{{ file.name }}</span>
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
        private scriptLoader: ScriptLoaderService
    ) { }

    async ngOnInit(): Promise<void> {
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
