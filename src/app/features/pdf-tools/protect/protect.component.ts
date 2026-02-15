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
    selector: 'app-protect',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    template: `
    <div class="min-h-screen bg-gray-50">
        <div class="py-12 text-center" style="background-color: #DCFCE7;">
            <div class="w-16 h-16 bg-white/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-lock text-3xl" style="color: #22C55E;"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Protect PDF</h1>
            <p class="text-gray-600">Add password protection to PDF file</p>
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
                        <label class="block text-sm font-medium text-gray-700 mb-2">Set Password</label>
                        <input type="password" [(ngModel)]="password" placeholder="Enter new password..."
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input type="password" [(ngModel)]="confirmPassword" placeholder="Confirm password..."
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    </div>

                    <div *ngIf="password && confirmPassword && password !== confirmPassword" 
                         class="text-red-500 text-sm">
                        Passwords do not match
                    </div>

                    <button (click)="protectPdf()" [disabled]="isProcessing || !password || password !== confirmPassword"
                            class="w-full px-4 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors disabled:opacity-50">
                        <span *ngIf="isProcessing"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Protecting...</span>
                        <span *ngIf="!isProcessing"><i class="fa-solid fa-lock mr-2"></i>Protect PDF</span>
                    </button>
                </div>

                <!-- Result Section -->
                <div *ngIf="resultReady" class="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div class="text-center mb-4">
                        <i class="fa-solid fa-circle-check text-green-500 text-4xl mb-2"></i>
                        <h3 class="font-bold text-green-800 text-lg">PDF Protected!</h3>
                        <p class="text-green-600 text-sm">Your PDF is ready for download</p>
                    </div>
                   
                    
                    <div class="flex flex-col md:flex-row gap-3">
                        <button (click)="downloadResult()" 
                                class="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200">
                            <i class="fa-solid fa-download"></i> Download PDF
                        </button>
                        
                        <!-- Send to Tool -->
                        <app-send-to-tool 
                            [hasOutput]="!!pdfDataUrl"
                            [currentRoute]="'/pdf/protect'"
                            [outputData]="pdfDataUrl"
                            [fileName]="getOutputFileName()"
                            [fileType]="'pdf'">
                        </app-send-to-tool>
                    </div>

                    <div class="flex gap-4 mt-4 justify-center">
                        <button (click)="reset()" class="text-green-600 hover:text-green-800 font-medium text-sm">
                            <i class="fa-solid fa-plus mr-1"></i> Protect Another
                        </button>
                    </div>
                </div>
                </div>
            </div>

            <!-- SEO Content -->
            <article class="prose lg:prose-xl mx-auto mt-16 px-4 max-w-4xl">
                <h2 class="text-3xl font-bold text-gray-900 mb-6">Protect PDF — Lock Your Documents with a Password</h2>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    Sending a contract over email? Sharing sensitive financials on Slack? Before you hit send, lock the PDF with a password so only the intended recipient can open it. This tool encrypts your PDF with industry-standard algorithms — anyone who tries to open the file gets a password prompt. No password, no access.
                </p>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    You set the password, confirm it to avoid typos, and the encrypted file is ready for download. The protection works in every PDF reader — Adobe Acrobat, Chrome's built-in viewer, Preview on Mac, and mobile apps. It's real encryption, not just a suggestion.
                </p>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">What People Protect</h2>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    Tax documents, legal contracts, salary slips, medical records, exam papers, business proposals, and confidential reports. Basically anything you wouldn't want the wrong person to read. It's also useful for distributing preview copies of paid content — the password acts as a simple access control.
                </p>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">Security Details</h2>
                <p class="text-gray-600 mb-8 leading-relaxed">
                    Your PDF is uploaded over encrypted HTTPS, processed on our server, and deleted immediately after the protected version is returned to your browser. We don't store your files or passwords. The encryption itself uses standard PDF security algorithms supported by all major PDF readers.
                </p>

                <h2 class="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                <div class="space-y-4">
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">What if I forget the password?</h3>
                        <p class="text-gray-600">There's no recovery option — we don't store your password. If you lose it, the encrypted file can't be opened. Use a password manager to keep track of it, and always keep a copy of the original unprotected file.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Is the encryption strong enough for business use?</h3>
                        <p class="text-gray-600">Yes — the tool uses industry-standard PDF encryption that's compatible with Adobe Acrobat and all major PDF readers. It's suitable for business contracts, financial documents, and legal filings.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Can I remove the password later?</h3>
                        <p class="text-gray-600">Yes — use the Unlock PDF tool. You'll need to provide the current password to authorize removal. You can also change the password by unlocking and re-protecting with a new one.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Does the protected file work on phones?</h3>
                        <p class="text-gray-600">Yes — password-protected PDFs work on all mobile PDF readers. The password prompt appears just like it does on desktop.</p>
                    </div>
                    <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h3 class="font-bold text-gray-900 mb-2">Is there a cost?</h3>
                        <p class="text-gray-600">No — completely free. No registration, no file limits, and we don't add any branding or watermarks to your document.</p>
                    </div>
                </div>
            </article>
        </div>
  `
})
export class ProtectComponent implements OnInit {
    file: File | null = null;
    isProcessing = false;
    password = '';
    confirmPassword = '';

    resultReady = false;
    pdfBlob: Blob | null = null;
    pdfDataUrl = '';
    encryptionSuccess = false;

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
            title: 'Protect PDF - Encrypt & Lock PDF Online',
            description: 'Password protect PDF files online. Encrypt your PDF documents with a strong password. Secure sensitive data for free.',
            keywords: 'protect pdf, lock pdf, encrypt pdf, password protect pdf, secure pdf, pdf security tool',
            url: 'https://2olhub.netlify.app/pdf/protect'
        });
        this.seoService.setFaqJsonLd([
            { question: 'What if I forget the password?', answer: 'There\'s no recovery option — we don\'t store your password. Always keep a copy of the original unprotected file.' },
            { question: 'Is the encryption strong enough for business use?', answer: 'Yes — the tool uses industry-standard PDF encryption compatible with Adobe Acrobat and all major PDF readers.' },
            { question: 'Can I remove the password later?', answer: 'Yes — use the Unlock PDF tool. You\'ll need to provide the current password to authorize removal.' },
            { question: 'Does the protected file work on phones?', answer: 'Yes — password-protected PDFs work on all mobile PDF readers. The password prompt appears just like it does on desktop.' },
            { question: 'Is there a cost?', answer: 'No — completely free. No registration, no file limits, and we don\'t add any branding or watermarks.' }
        ]);

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
        return this.file ? `protected_${this.file.name}` : 'protected.pdf';
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

    async protectPdf() {
        if (!this.file || !this.password || this.password !== this.confirmPassword) return;
        this.isProcessing = true;
        this.cdr.detectChanges();

        try {
            // Use backend API for real PDF encryption
            const formData = new FormData();
            formData.append('file', this.file);
            formData.append('password', this.password);

            const response = await fetch(`${environment.apiUrl}/pdf/protect`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to protect PDF');
            }

            // Check if encryption was successful
            const protectionStatus = response.headers.get('X-Protection-Status');
            this.encryptionSuccess = protectionStatus === 'encrypted';

            this.pdfBlob = await response.blob();

            // Generate data URL for Tool Chain
            const reader = new FileReader();
            reader.onloadend = () => {
                this.ngZone.run(() => {
                    this.pdfDataUrl = reader.result as string;
                    this.resultReady = true;
                    this.isProcessing = false;
                    this.analyticsService.trackToolUsage('pdf-protect', 'Protect PDF', 'pdf');
                    this.cdr.detectChanges();
                });
            };
            reader.readAsDataURL(this.pdfBlob);

        } catch (error: any) {
            console.error('Error protecting PDF:', error);
            this.ngZone.run(() => {
                this.isProcessing = false;
                this.cdr.detectChanges();
                alert(error.message || 'Failed to protect PDF. Please try again.');
            });
        }
    }

    downloadResult() {
        if (this.pdfBlob && this.file) {
            saveAs(this.pdfBlob, `protected_${this.file.name}`);
        }
    }

    reset() {
        this.file = null;
        this.resultReady = false;
        this.pdfBlob = null;
        this.pdfDataUrl = '';
        this.password = '';
        this.confirmPassword = '';
    }
}
