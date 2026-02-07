import { Component, ChangeDetectorRef, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { ScriptLoaderService } from '../../../core/services/script-loader.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SeoService } from '../../../core/services/seo.service';
import { environment } from '../../../../environments/environment';

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
                            <p class="text-gray-700 font-medium truncate max-w-[200px]">{{ file.name }}</p>
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

            <!-- SEO Content -->
                <article class="prose lg:prose-xl mx-auto mt-16 px-4 max-w-4xl">
                    <h1 class="text-3xl font-bold text-gray-900 mb-6">Unlock PDF - Remove Password Online for Free</h1>
                    <p class="text-gray-600 mb-8 leading-relaxed">
                        Remove password security from your PDF files instantly. 
                        If you have the password but want to remove it for easier access, this free tool is the perfect solution.
                    </p>

                    <h2 class="text-2xl font-bold text-gray-800 mb-4">How to Unlock PDF?</h2>
                    <ol class="list-decimal pl-6 mb-8 space-y-2 text-gray-600">
                        <li><strong>Upload PDF:</strong> Select your password-protected file.</li>
                        <li><strong>Enter Password:</strong> Input the current correct password to authorize the removal.</li>
                        <li><strong>Unlock:</strong> Click the button to strip the security settings permanently.</li>
                        <li><strong>Download:</strong> Get your new, unlocked PDF file.</li>
                    </ol>

                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Why use our PDF Unlocker?</h2>
                    <ul class="list-disc pl-6 mb-8 space-y-2 text-gray-600">
                        <li><strong>Permanent Removal:</strong> The file will no longer require a password to open.</li>
                        <li><strong>Secure Processing:</strong> Your password and file are processed securely via SSL.</li>
                        <li><strong>Fast & Easy:</strong> Remove restrictions in seconds.</li>
                        <li><strong>All Devices:</strong> Works on Windows, Mac, Linux, and mobile devices.</li>
                    </ul>

                    <h2 class="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                    <div class="space-y-4">
                        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h3 class="font-bold text-gray-900 mb-2">Can I remove a password I don't know?</h3>
                            <p class="text-gray-600">No, for legal and ethical reasons, you must know the password to remove it. This tool is for owners who want to remove known passwords.</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <h3 class="font-bold text-gray-900 mb-2">Is the file copying safe?</h3>
                            <p class="text-gray-600">We do not store your passwords or files. Everything is deleted immediately after processing.</p>
                        </div>
                    </div>
                </article>
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
        private scriptLoader: ScriptLoaderService,
        private analyticsService: AnalyticsService,
        private seoService: SeoService
    ) { }

    async ngOnInit(): Promise<void> {
        // Initialize SEO and load scripts
        this.seoService.updateSeo({
            title: 'Unlock PDF - Remove Password from PDF Online',
            description: 'Remove password protection from PDF files online. Unlock secured PDFs instantly if you know the password. Free and secure PDF unlocker.',
            keywords: 'unlock pdf, remove pdf password, pdf password remover, decrypt pdf, open secured pdf, free pdf tool',
            url: 'https://2olhub.netlify.app/pdf/unlock'
        });

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

            const response = await fetch(`${environment.apiUrl}/pdf/unlock`, {
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
                    this.analyticsService.trackToolUsage('pdf-unlock', 'Unlock PDF', 'pdf');
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
