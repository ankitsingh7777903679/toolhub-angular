import { Component, ChangeDetectorRef, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { ScriptLoaderService } from '../../../core/services/script-loader.service';

declare const PDFLib: any;
declare const saveAs: any;

@Component({
    selector: 'app-rotate',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    template: `
    <div class="min-h-screen bg-gray-50">
        <div class="py-12 text-center" style="background-color: #EDE9FE;">
            <div class="w-16 h-16 bg-white/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-rotate text-3xl" style="color: #8B5CF6;"></i>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Rotate PDF</h1>
            <p class="text-gray-600">Rotate PDF pages to any angle</p>
        </div>

        <div class="container mx-auto px-4 py-8">
            <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
                <!-- Upload Area (hide when result ready) -->
                <div *ngIf="!resultReady" class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 hover:bg-purple-50 transition-colors cursor-pointer"
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
                        <label class="block text-sm font-medium text-gray-700 mb-2">Rotation</label>
                        <div class="grid grid-cols-4 gap-2">
                            <button *ngFor="let deg of [90, 180, 270, 0]" 
                                    (click)="rotation = deg"
                                    [class]="rotation === deg ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700'"
                                    class="px-4 py-3 rounded-lg font-medium hover:bg-purple-400 hover:text-white transition-colors">
                                {{ deg === 0 ? 'Reset' : deg + '°' }}
                            </button>
                        </div>
                    </div>

                    <button (click)="rotatePdf()" [disabled]="isProcessing"
                            class="w-full px-4 py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition-colors disabled:opacity-50">
                        <span *ngIf="isProcessing"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Rotating...</span>
                        <span *ngIf="!isProcessing"><i class="fa-solid fa-rotate mr-2"></i>Rotate PDF</span>
                    </button>
                </div>

                <!-- Result Section -->
                <div *ngIf="resultReady" class="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <div class="text-center mb-4">
                        <i class="fa-solid fa-circle-check text-purple-500 text-4xl mb-2"></i>
                        <h3 class="font-bold text-purple-800 text-lg">PDF Rotated!</h3>
                        <p class="text-purple-600 text-sm">All pages rotated by {{ appliedRotation }}°</p>
                    </div>
                    
                    <div class="flex flex-col md:flex-row gap-3">
                        <button (click)="downloadResult()" 
                                class="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-200">
                            <i class="fa-solid fa-download"></i> Download PDF
                        </button>
                        
                        <!-- Send to Tool -->
                        <app-send-to-tool 
                            [hasOutput]="!!pdfDataUrl"
                            [currentRoute]="'/pdf/rotate'"
                            [outputData]="pdfDataUrl"
                            [fileName]="getOutputFileName()"
                            [fileType]="'pdf'">
                        </app-send-to-tool>
                    </div>

                    <div class="flex gap-4 mt-4 justify-center">
                        <button (click)="reset()" class="text-purple-600 hover:text-purple-800 font-medium text-sm">
                            <i class="fa-solid fa-plus mr-1"></i> Rotate Another
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `
})
export class RotateComponent implements OnInit {
    file: File | null = null;
    isProcessing = false;
    rotation = 90;

    resultReady = false;
    pdfBlob: Blob | null = null;
    pdfDataUrl = '';
    appliedRotation = 0;

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
                this.file = new File([blob], fileName, { type: 'application/pdf' });
                this.cdr.detectChanges();
            });
    }

    getOutputFileName(): string {
        return this.file ? `rotated_${this.file.name}` : 'rotated.pdf';
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

    async rotatePdf() {
        if (!this.file) return;
        this.isProcessing = true;
        this.cdr.detectChanges();

        try {
            const arrayBuffer = await this.file.arrayBuffer();
            const { PDFDocument, degrees } = PDFLib;
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();

            pages.forEach((page: any) => {
                page.setRotation(degrees(this.rotation));
            });

            const pdfBytes = await pdfDoc.save();
            this.pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
            this.appliedRotation = this.rotation;

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
            console.error('Error rotating PDF:', error);
            this.ngZone.run(() => {
                this.isProcessing = false;
                this.cdr.detectChanges();
                alert('Failed to rotate PDF. Please try again.');
            });
        }
    }

    downloadResult() {
        if (this.pdfBlob && this.file) {
            saveAs(this.pdfBlob, `rotated_${this.file.name}`);
        }
    }

    reset() {
        this.file = null;
        this.resultReady = false;
        this.pdfBlob = null;
        this.pdfDataUrl = '';
        this.appliedRotation = 0;
        this.rotation = 90;
    }
}
