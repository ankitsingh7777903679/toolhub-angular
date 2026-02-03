import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { ScriptLoaderService } from '../../../core/services/script-loader.service';
import { AnalyticsService } from '../../../core/services/analytics.service';

declare const html2pdf: any;

@Component({
    selector: 'app-html-to-pdf',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    template: `
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <div class="py-8 md:py-12 text-center px-4" style="background-color: #CCFBF1;">
            <div class="w-12 h-12 md:w-16 md:h-16 bg-white/40 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                <i class="fa-solid fa-code text-2xl md:text-3xl" style="color: #14B8A6;"></i>
            </div>
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">HTML to PDF</h1>
            <p class="text-gray-600 text-sm md:text-base">Convert web pages or HTML to PDF documents</p>
        </div>

        <div class="container mx-auto px-3 md:px-4 py-4 md:py-8">
            <!-- Editor View (hide when result ready) -->
            <div *ngIf="!resultReady" class="flex flex-col lg:grid lg:grid-cols-2 gap-4 md:gap-6">
                
                <!-- Editor Section -->
                <div class="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden min-h-[250px] md:min-h-[400px]">
                    <div class="p-3 md:p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 class="font-bold text-gray-800 text-sm md:text-base">
                            <i class="fa-solid fa-code text-teal-500 mr-2"></i>HTML Input
                        </h3>
                        <button (click)="loadSample()" class="text-xs text-teal-600 font-bold hover:underline">
                            Load Sample
                        </button>
                    </div>
                    <textarea [(ngModel)]="htmlContent" 
                              class="flex-1 w-full p-3 md:p-4 font-mono text-xs md:text-sm resize-none focus:outline-none focus:bg-teal-50/20 transition-colors min-h-[180px] md:min-h-[300px]"
                              placeholder="<h1>Hello World</h1>..."></textarea>
                </div>

                <!-- Preview Section -->
                <div class="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden min-h-[300px] md:min-h-[400px]">
                    <div class="p-3 md:p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 class="font-bold text-gray-800 text-sm md:text-base">
                            <i class="fa-solid fa-eye text-teal-500 mr-2"></i>Preview
                        </h3>
                    </div>
                    <div class="flex-1 p-4 md:p-8 overflow-y-auto pdf-preview" id="preview-container" 
                         style="background-color: #ffffff !important; color: #000000 !important;">
                        <div id="pdf-content" [innerHTML]="sanitizedHtml" class="prose max-w-none text-sm md:text-base"></div>
                    </div>
                </div>

                <!-- Floating Generate Button (Mobile) -->
                <div class="lg:col-span-2">
                    <button (click)="convertToPdf()" [disabled]="isProcessing || !htmlContent"
                        class="w-full px-4 py-3 md:py-4 bg-teal-500 text-white text-base rounded-xl font-bold hover:bg-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-teal-200/50">
                        <i *ngIf="isProcessing" class="fa-solid fa-spinner fa-spin"></i>
                        <i *ngIf="!isProcessing" class="fa-solid fa-file-pdf"></i>
                        <span>{{ isProcessing ? 'Generating...' : 'Generate PDF' }}</span>
                    </button>
                </div>
            </div>

            <!-- Result Section -->
            <div *ngIf="resultReady" class="max-w-lg mx-auto">
                <div class="bg-white rounded-xl shadow-lg p-4 md:p-6">
                    <div class="bg-teal-50 border border-teal-200 rounded-xl p-5 md:p-6">
                        <div class="text-center mb-4">
                            <i class="fa-solid fa-circle-check text-teal-500 text-4xl md:text-5xl mb-3"></i>
                            <h3 class="font-bold text-teal-800 text-lg md:text-xl">PDF Generated!</h3>
                            <p class="text-teal-600 text-sm mt-1">Your PDF is ready for download</p>
                        </div>
                        
                        <div class="flex flex-col md:flex-row gap-3 justify-center">
                            <button (click)="downloadPdf()" 
                                    class="flex-1 px-5 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-200">
                                <i class="fa-solid fa-download"></i> Download PDF
                            </button>
                            
                            <!-- Send to Tool -->
                            <app-send-to-tool 
                                [hasOutput]="!!pdfDataUrl"
                                [currentRoute]="'/pdf/html-to-pdf'"
                                [outputData]="pdfDataUrl"
                                [fileName]="getOutputFileName()"
                                [fileType]="'pdf'">
                            </app-send-to-tool>
                        </div>

                        <button (click)="reset()" class="w-full mt-4 text-teal-600 hover:text-teal-800 font-medium text-sm py-2">
                            <i class="fa-solid fa-plus mr-1"></i> Create Another PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `,
    styles: [`
    /* PDF Preview - always white like a real PDF, ignore dark mode */
    .pdf-preview,
    .pdf-preview * {
        background-color: inherit;
        color: inherit;
    }
    .pdf-preview {
        background-color: #ffffff !important;
        color: #000000 !important;
    }
    :host ::ng-deep .prose h1 { font-size: 2em; font-weight: bold; margin-bottom: 0.5em; color: inherit; }
    :host ::ng-deep .prose h2 { font-size: 1.5em; font-weight: bold; margin-bottom: 0.5em; color: inherit; }
    :host ::ng-deep .prose p { margin-bottom: 1em; color: inherit; }
    :host ::ng-deep .prose ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
    :host ::ng-deep .prose table { width: 100%; border-collapse: collapse; margin-bottom: 1em; }
    :host ::ng-deep .prose th, :host ::ng-deep .prose td { border: 1px solid #ddd; padding: 8px; }
  `]
})
export class HtmlToPdfComponent {
    htmlContent = '';
    isProcessing = false;

    resultReady = false;
    pdfBlob: Blob | null = null;
    pdfDataUrl = '';

    constructor(
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone,
        private sanitizer: DomSanitizer,
        private scriptLoader: ScriptLoaderService,
        private analyticsService: AnalyticsService
    ) {
        this.loadSample();
        this.initScripts();
    }

    private async initScripts() {
        await this.scriptLoader.load(['html2pdf']);
    }

    // Bypass Angular's HTML sanitization to preserve inline styles
    get sanitizedHtml(): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(this.htmlContent);
    }

    getOutputFileName(): string {
        return `document_${new Date().getTime()}.pdf`;
    }

    loadSample() {
        this.htmlContent = `
<div style="font-family: Arial, sans-serif; color: #333;">
    <h1 style="color: #14B8A6; border-bottom: 2px solid #14B8A6; padding-bottom: 10px;">Weekly Report</h1>
    <p>This is a sample PDF generated from HTML content. You can edit this text on the left!</p>
    
    <div style="background-color: #f0fdfa; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #0f766e;">Key Highlights</h3>
        <ul>
            <li>Client-side PDF generation</li>
            <li>Real-time preview</li>
            <li>Fast and secure</li>
        </ul>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr style="background-color: #14B8A6; color: white;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: left;">Status</th>
            <th style="padding: 10px; text-align: left;">Progress</th>
        </tr>
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Design</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; color: green;">Completed</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">100%</td>
        </tr>
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">Development</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; color: orange;">In Progress</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd;">75%</td>
        </tr>
    </table>
</div>`;
    }

    async convertToPdf() {
        if (!this.htmlContent) return;
        this.isProcessing = true;
        this.cdr.detectChanges();

        try {
            // Get original element
            const originalElement = document.getElementById('pdf-content');
            if (!originalElement) throw new Error('Preview element not found');

            // CLONE STRATEGY: Create a clean container overlay
            // We place it ON TOP of everything to ensure visibility and 0,0 coordinates
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.left = '0';
            container.style.top = '0';
            container.style.width = '100vw'; // Use full viewport width to capture everything
            container.style.height = '100vh'; // Use full viewport height
            container.style.zIndex = '9999';
            container.style.background = '#ffffff';
            container.style.overflow = 'hidden'; // Hide scrollbars
            container.className = 'html2pdf-container';

            // Create a wrapper for the content to constrain width to A4-like proportions
            const contentWrapper = document.createElement('div');
            contentWrapper.style.width = '800px'; // Force A4-like width
            contentWrapper.style.margin = '0 auto'; // Center it (optional, but good for debugging)
            contentWrapper.style.background = '#ffffff';
            contentWrapper.style.padding = '20px';

            // Clone the content
            const clone = originalElement.cloneNode(true) as HTMLElement;

            // Ensure clone styling
            clone.style.width = '100%';
            clone.style.height = 'auto';
            clone.style.background = '#ffffff';
            clone.style.color = '#000000';

            contentWrapper.appendChild(clone);
            container.appendChild(contentWrapper);
            document.body.appendChild(container);

            // Optimized options
            const opt = {
                margin: [10, 10, 10, 10],
                filename: this.getOutputFileName(),
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    scrollY: 0,
                    x: 0,
                    y: 0,
                    windowWidth: 800 // Match wrapper width
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait',
                    compress: true
                },
                pagebreak: { mode: 'avoid-all', after: '.page-break' }
            };

            // Generate PDF from the CONTENT WRAPPER
            this.pdfBlob = await html2pdf().set(opt).from(contentWrapper).outputPdf('blob');

            // Cleanup
            document.body.removeChild(container);

            // Generate data URL for Tool Chain
            const reader = new FileReader();
            reader.onloadend = () => {
                this.ngZone.run(() => {
                    this.pdfDataUrl = reader.result as string;
                    this.resultReady = true;
                    this.isProcessing = false;
                    this.analyticsService.trackToolUsage('html-to-pdf', 'HTML to PDF', 'pdf');
                    this.cdr.detectChanges();
                });
            };
            reader.readAsDataURL(this.pdfBlob!);

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
            this.ngZone.run(() => {
                this.isProcessing = false;
                this.cdr.detectChanges();
            });
        }
    }

    downloadPdf() {
        if (!this.pdfBlob) return;
        const url = URL.createObjectURL(this.pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.getOutputFileName();
        link.click();
        URL.revokeObjectURL(url);
    }

    reset() {
        this.resultReady = false;
        this.pdfBlob = null;
        this.pdfDataUrl = '';
    }
}
