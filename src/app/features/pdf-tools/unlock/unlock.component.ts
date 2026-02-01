import { Component, ChangeDetectorRef, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { ScriptLoaderService } from '../../../core/services/script-loader.service';

declare const PDFLib: any;
declare const saveAs: any;

@Component({
    selector: 'app-unlock',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    template: `
    <div class="min-h-screen bg-gray-50">
        <div class="py-12 text-center" style="background-color: #FEE2E2;">
            <div class="w-16 h-16 bg-white/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-lock-open text-3xl" style="color: #EF4444;"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Unlock PDF</h1>
            <p class="text-gray-600">Remove password protection from PDF</p>
        </div>

        <div class="container mx-auto px-4 py-8">
            <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
                <!-- Upload Area (hide when result ready) -->
                <div *ngIf="!resultReady" class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-500 hover:bg-red-50 transition-colors cursor-pointer"
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
                            <p class="text-gray-700 font-medium">{{ file.name }}</p>
                        </div>
                        <button (click)="file = null" class="text-red-400 hover:text-red-600">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input type="password" [(ngModel)]="password" placeholder="Enter PDF password..."
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    </div>

                    <div *ngIf="errorMessage" class="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                        <i class="fa-solid fa-exclamation-circle mr-1"></i>{{ errorMessage }}
                    </div>

                    <button (click)="unlockPdf()" [disabled]="isProcessing"
                            class="w-full px-4 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50">
                        <span *ngIf="isProcessing"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Unlocking...</span>
                        <span *ngIf="!isProcessing"><i class="fa-solid fa-lock-open mr-2"></i>Unlock PDF</span>
                    </button>
                </div>

                <!-- Result Section -->
                <div *ngIf="resultReady" class="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div class="text-center mb-4">
                        <i class="fa-solid fa-circle-check text-red-500 text-4xl mb-2"></i>
                        <h3 class="font-bold text-red-800 text-lg">PDF Unlocked!</h3>
                        <p class="text-red-600 text-sm">Password protection removed</p>
                    </div>
                    
                    <div class="flex flex-col md:flex-row gap-3">
                        <button (click)="downloadResult()" 
                                class="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200">
                            <i class="fa-solid fa-download"></i> Download PDF
                        </button>
                        
                        <!-- Send to Tool -->
                        <app-send-to-tool 
                            [hasOutput]="!!pdfDataUrl"
                            [currentRoute]="'/pdf/unlock'"
                            [outputData]="pdfDataUrl"
                            [fileName]="getOutputFileName()"
                            [fileType]="'pdf'">
                        </app-send-to-tool>
                    </div>

                    <div class="flex gap-4 mt-4 justify-center">
                        <button (click)="reset()" class="text-red-600 hover:text-red-800 font-medium text-sm">
                            <i class="fa-solid fa-plus mr-1"></i> Unlock Another
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `
})
export class UnlockComponent implements OnInit {
    file: File | null = null;
    isProcessing = false;
    password = '';

    resultReady = false;
    pdfBlob: Blob | null = null;
    pdfDataUrl = '';
    errorMessage = '';

    constructor(
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone,
        private workspaceService: WorkspaceService,
        private scriptLoader: ScriptLoaderService
    ) { }

    async ngOnInit(): Promise<void> {
        await this.scriptLoader.load(['file-saver']);

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
        return this.file ? `unlocked_${this.file.name}` : 'unlocked.pdf';
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

    async unlockPdf() {
        if (!this.file) return;
        this.isProcessing = true;
        this.errorMessage = '';
        this.cdr.detectChanges();

        try {
            // Use backend API for proper PDF decryption
            const formData = new FormData();
            formData.append('file', this.file);
            formData.append('password', this.password || '');

            const response = await fetch('http://localhost:3000/api/pdf/unlock', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to unlock PDF');
            }

            this.pdfBlob = await response.blob();

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

        } catch (error: any) {
            console.error('Error unlocking PDF:', error);
            this.ngZone.run(() => {
                this.isProcessing = false;
                this.errorMessage = error.message?.includes('password')
                    ? 'Incorrect password. Please try again.'
                    : error.message || 'Failed to unlock PDF.';
                this.cdr.detectChanges();
            });
        }
    }

    downloadResult() {
        if (this.pdfBlob && this.file) {
            saveAs(this.pdfBlob, `unlocked_${this.file.name}`);
        }
    }

    reset() {
        this.file = null;
        this.resultReady = false;
        this.pdfBlob = null;
        this.pdfDataUrl = '';
        this.password = '';
    }
}
