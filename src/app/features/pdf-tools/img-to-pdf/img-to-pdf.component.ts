import { Component, ChangeDetectorRef, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { ScriptLoaderService } from '../../../core/services/script-loader.service';
import { AnalyticsService } from '../../../core/services/analytics.service';

declare const PDFLib: any;
declare const saveAs: any;

@Component({
    selector: 'app-img-to-pdf',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    template: `
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <div class="py-12 text-center" style="background-color: #FCE7F3;">
            <div class="w-16 h-16 bg-white/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-file-image text-3xl" style="color: #EC4899;"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Image to PDF</h1>
            <p class="text-gray-600">Convert images to PDF document</p>
        </div>

        <div class="container mx-auto px-4 py-8">
            <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
                
                <!-- Upload Area -->
                <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-pink-500 hover:bg-pink-50 transition-colors cursor-pointer mb-8"
                     (click)="fileInput.click()" 
                     (dragover)="onDragOver($event)" 
                     (drop)="onDrop($event)">
                    <input #fileInput type="file" multiple accept="image/*" (change)="onFileSelect($event)" class="hidden">
                    <i class="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-3"></i>
                    <p class="text-gray-600 font-medium">Click to upload images</p>
                    <p class="text-gray-400 text-sm mt-1">Supports JPG, PNG</p>
                </div>

                <!-- Input Options -->
                 <div class="mb-6 bg-pink-50 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-center" *ngIf="files.length > 0">
                    <label class="flex items-center gap-2 text-gray-700 font-medium">
                        <input type="checkbox" [(ngModel)]="fitToPage" class="w-5 h-5 accent-pink-500">
                        Fit to A4 Page
                    </label>
                    <span class="text-gray-400">|</span>
                    <label class="flex items-center gap-2 text-gray-700 font-medium">
                        <input type="checkbox" [(ngModel)]="addMargin" class="w-5 h-5 accent-pink-500">
                        Add Margin
                    </label>
                </div>

                <!-- File List -->
                <div *ngIf="files.length > 0" class="space-y-3 mb-8">
                    <h3 class="font-bold text-gray-800 mb-4">Selected Images ({{files.length}})</h3>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div *ngFor="let file of filesWithPreview; let i = index" class="relative group aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <img [src]="file.preview" class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button (click)="moveLeft(i)" *ngIf="i > 0" class="p-2 text-white hover:text-pink-300 transition-colors">
                                    <i class="fa-solid fa-arrow-left"></i>
                                </button>
                                <button (click)="removeFile(i)" class="p-2 text-red-400 hover:text-red-500 transition-colors">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                                <button (click)="moveRight(i)" *ngIf="i < filesWithPreview.length - 1" class="p-2 text-white hover:text-pink-300 transition-colors">
                                    <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                            <div class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs truncate p-1 text-center">
                                {{ i + 1 }}. {{ file.file.name }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-4" *ngIf="files.length > 0 && !pdfReady">
                    <button (click)="clearAll()" class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                        Clear All
                    </button>
                    <button (click)="convertToPdf()" [disabled]="isProcessing" 
                            class="flex-1 px-4 py-3 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-pink-200">
                        <span *ngIf="isProcessing"><i class="fa-solid fa-spinner fa-spin"></i> Processing...</span>
                        <span *ngIf="!isProcessing">Convert to PDF</span>
                    </button>
                </div>

                <!-- PDF Ready - Download Section -->
                <div *ngIf="pdfReady" class="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
                    <div class="text-center mb-4">
                        <i class="fa-solid fa-circle-check text-green-500 text-4xl mb-2"></i>
                        <h3 class="font-bold text-green-800 text-lg">PDF Ready!</h3>
                        <p class="text-green-600 text-sm">Your PDF has been created successfully</p>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row gap-4 items-center justify-center">
                        <div class="flex-1 w-full sm:max-w-xs">
                            <label class="text-gray-700 text-sm font-medium mb-1 block">PDF Filename (optional)</label>
                            <input [(ngModel)]="pdfFileName" 
                                   type="text" 
                                   placeholder="my-document"
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none">
                        </div>
                        <button (click)="downloadPdf()" 
                                class="px-6 py-3 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 transition-colors flex items-center gap-2 shadow-lg shadow-pink-200">
                            <i class="fa-solid fa-download"></i> Download PDF
                        </button>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4 mt-4 justify-center">
                        <button (click)="createAnother()" class="text-pink-600 hover:text-pink-800 font-medium text-sm flex-1 md:flex-none">
                            <i class="fa-solid fa-plus mr-1"></i> Create Another PDF
                        </button>
                        
                        <!-- Send to PDF Tools -->
                        <div class="flex-1 md:flex-none">
                            <app-send-to-tool 
                                [hasOutput]="pdfReady && !!pdfDataUrl"
                                [currentRoute]="'/pdf/img-to-pdf'"
                                [outputData]="pdfDataUrl"
                                [fileName]="getPdfFileName()"
                                [fileType]="'pdf'">
                            </app-send-to-tool>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  `
})
export class ImgToPdfComponent implements OnInit {
    files: File[] = [];
    filesWithPreview: { file: File, preview: string }[] = [];
    isProcessing = false;
    fitToPage = true;
    addMargin = false;
    pdfReady = false;
    pdfBlob: Blob | null = null;
    pdfFileName = '';
    pdfDataUrl = '';  // For Tool Chain

    getPdfFileName(): string {
        return (this.pdfFileName.trim() || 'converted') + '.pdf';
    }

    private workspaceService: WorkspaceService;

    constructor(
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone,
        workspaceService: WorkspaceService,
        private scriptLoader: ScriptLoaderService,
        private analyticsService: AnalyticsService
    ) {
        this.workspaceService = workspaceService;
    }

    async ngOnInit(): Promise<void> {
        await this.scriptLoader.load(['pdf-lib', 'file-saver']);

        // Check if there's an image from another tool
        if (this.workspaceService.hasFile()) {
            const file = this.workspaceService.getFile();
            if (file && file.fileType === 'image') {
                this.loadImageFromWorkspace(file.data, file.fileName);
            }
        }
    }

    private loadImageFromWorkspace(dataUrl: string, fileName: string): void {
        fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
                const imageFile = new File([blob], fileName, { type: blob.type });
                this.files = [imageFile];
                this.filesWithPreview = [{ file: imageFile, preview: dataUrl }];
                this.cdr.detectChanges();
            });
    }

    onFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.handleFiles(Array.from(input.files));
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
            this.handleFiles(Array.from(event.dataTransfer.files));
        }
    }

    handleFiles(newFiles: File[]) {
        // If a PDF was already created, reset everything for a fresh start
        if (this.pdfReady) {
            this.pdfReady = false;
            this.pdfBlob = null;
            this.pdfFileName = '';
            this.files = [];
            this.filesWithPreview = [];
        }

        const imageFiles = newFiles.filter(f => f.type.startsWith('image/'));
        this.files = [...this.files, ...imageFiles];

        // Generate previews
        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.filesWithPreview.push({
                    file: file,
                    preview: e.target.result
                });
                this.cdr.detectChanges();
            };
            reader.readAsDataURL(file);
        });
    }

    removeFile(index: number) {
        this.files.splice(index, 1);
        this.filesWithPreview.splice(index, 1);
    }

    moveLeft(index: number) {
        if (index > 0) {
            [this.files[index], this.files[index - 1]] = [this.files[index - 1], this.files[index]];
            [this.filesWithPreview[index], this.filesWithPreview[index - 1]] = [this.filesWithPreview[index - 1], this.filesWithPreview[index]];
        }
    }

    moveRight(index: number) {
        if (index < this.files.length - 1) {
            [this.files[index], this.files[index + 1]] = [this.files[index + 1], this.files[index]];
            [this.filesWithPreview[index], this.filesWithPreview[index + 1]] = [this.filesWithPreview[index + 1], this.filesWithPreview[index]];
        }
    }

    clearAll() {
        this.files = [];
        this.filesWithPreview = [];
    }

    async convertToPdf() {
        if (this.files.length === 0) return;

        this.isProcessing = true;
        try {
            const { PDFDocument, PageSizes } = PDFLib;
            const pdfDoc = await PDFDocument.create();

            for (const fileItem of this.filesWithPreview) {
                const imageBytes = await fileItem.file.arrayBuffer();
                let pdfImage;

                if (fileItem.file.type === 'image/jpeg' || fileItem.file.type === 'image/jpg') {
                    pdfImage = await pdfDoc.embedJpg(imageBytes);
                } else if (fileItem.file.type === 'image/png') {
                    pdfImage = await pdfDoc.embedPng(imageBytes);
                } else {
                    // Try PNG fallback for others if possible, or skip
                    continue;
                }

                let page;
                const imgDims = pdfImage.scale(1);

                if (this.fitToPage) {
                    page = pdfDoc.addPage(PageSizes.A4);
                    const { width, height } = page.getSize();
                    const margin = this.addMargin ? 50 : 0;
                    const availWidth = width - (margin * 2);
                    const availHeight = height - (margin * 2);

                    const scale = Math.min(availWidth / imgDims.width, availHeight / imgDims.height);
                    const scaledWidth = imgDims.width * scale;
                    const scaledHeight = imgDims.height * scale;

                    page.drawImage(pdfImage, {
                        x: margin + (availWidth - scaledWidth) / 2, // center
                        y: margin + (availHeight - scaledHeight) / 2, // center
                        width: scaledWidth,
                        height: scaledHeight,
                    });
                } else {
                    // Page size matches image
                    page = pdfDoc.addPage([imgDims.width, imgDims.height]);
                    page.drawImage(pdfImage, {
                        x: 0,
                        y: 0,
                        width: imgDims.width,
                        height: imgDims.height,
                    });
                }
            }

            const pdfBytes = await pdfDoc.save();
            this.pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

            // Generate data URL for Tool Chain
            const reader = new FileReader();
            reader.onloadend = () => {
                this.pdfDataUrl = reader.result as string;
                this.cdr.detectChanges();
            };
            reader.readAsDataURL(this.pdfBlob);

            // Update UI using NgZone
            this.ngZone.run(() => {
                this.pdfReady = true;
                this.isProcessing = false;
                this.analyticsService.trackToolUsage('img-to-pdf', 'Image to PDF', 'pdf');
                this.cdr.detectChanges();
            });
        } catch (error) {
            console.error('Error creating PDF:', error);
            alert('Failed to create PDF. Please ensure all images are valid JPG or PNG.');
            this.ngZone.run(() => {
                this.isProcessing = false;
                this.cdr.detectChanges();
            });
        }
    }

    downloadPdf() {
        if (!this.pdfBlob) return;

        // Use custom filename or default
        const filename = this.pdfFileName.trim()
            ? `${this.pdfFileName.trim().replace(/\.pdf$/i, '')}.pdf`
            : `images_to_pdf_${new Date().getTime()}.pdf`;

        saveAs(this.pdfBlob, filename);
    }

    createAnother() {
        this.pdfReady = false;
        this.pdfBlob = null;
        this.pdfFileName = '';
        this.pdfDataUrl = '';
        this.files = [];
        this.filesWithPreview = [];
    }
}

