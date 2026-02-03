import { Component, ChangeDetectorRef, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { ScriptLoaderService } from '../../../core/services/script-loader.service';
import { AnalyticsService } from '../../../core/services/analytics.service';

declare const saveAs: any;

@Component({
    selector: 'app-remove-bg',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Header -->
        <div class="py-12 text-center" style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);">
            <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-eraser text-3xl text-white"></i>
            </div>
            <h1 class="text-3xl font-bold text-white mb-2">Remove Background</h1>
            <p class="text-white/80">Automatically remove background from any image</p>
        </div>

        <div class="container mx-auto px-4 py-8">
            <div class="max-w-4xl mx-auto">
                
                <!-- Upload Area -->
                <div *ngIf="!originalImage" 
                     class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-cyan-500 transition-colors cursor-pointer"
                     (click)="fileInput.click()"
                     (dragover)="onDragOver($event)"
                     (drop)="onDrop($event)">
                    <input #fileInput type="file" accept="image/*" (change)="onFileSelect($event)" class="hidden">
                    <i class="fa-solid fa-cloud-arrow-up text-5xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600 dark:text-gray-300 font-medium text-lg">Click or drag image to remove background</p>
                    <p class="text-gray-400 text-sm mt-2">Supports JPG, PNG, WebP</p>
                </div>

                <!-- Image Comparison -->
                <div *ngIf="originalImage" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    
                    <!-- Status -->
                    <div *ngIf="isProcessing" class="text-center py-8">
                        <i class="fa-solid fa-eraser text-5xl text-cyan-500 animate-pulse mb-4"></i>
                        <p class="text-gray-600 dark:text-gray-300 font-medium">Removing background with AI...</p>
                        <p class="text-gray-400 text-sm mt-2">This may take 20-40 seconds</p>
                        <div class="mt-4 w-48 mx-auto">
                            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div class="h-full bg-cyan-500 rounded-full animate-pulse" style="width: 60%;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Before/After Comparison -->
                    <div *ngIf="!isProcessing" class="grid md:grid-cols-2 gap-6">
                        <!-- Original -->
                        <div class="text-center">
                            <h3 class="font-bold text-gray-800 dark:text-white mb-3">
                                <i class="fa-solid fa-image text-gray-400 mr-2"></i>Original
                            </h3>
                            <div class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                <img [src]="originalImage" class="w-full h-auto max-h-80 object-contain">
                            </div>
                            <p class="text-xs text-gray-400 mt-2">{{ originalFileName }}</p>
                        </div>

                        <!-- Processed -->
                        <div class="text-center">
                            <h3 class="font-bold text-gray-800 dark:text-white mb-3">
                                <i class="fa-solid fa-check-circle text-cyan-500 mr-2"></i>Background Removed
                            </h3>
                            <div class="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden min-h-[200px] flex items-center justify-center" 
                                 [style.background]="selectedBgColor === 'transparent' ? 'repeating-conic-gradient(#e5e5e5 0% 25%, #ffffff 0% 50%) 50% / 20px 20px' : selectedBgColor">
                                <img *ngIf="processedImage" [src]="processedImage" class="w-full h-auto max-h-80 object-contain">
                                <div *ngIf="!processedImage && !error" class="text-gray-400 bg-white/80 px-4 py-2 rounded">
                                    <i class="fa-solid fa-arrow-up text-2xl mb-2"></i>
                                    <p class="text-sm">Click "Remove Background" to start</p>
                                </div>
                                <div *ngIf="error" class="text-red-500 p-4 bg-white/80 rounded">
                                    <i class="fa-solid fa-circle-exclamation text-2xl mb-2"></i>
                                    <p class="text-sm">{{ error }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Background Color Picker (only show after processing) -->
                    <div *ngIf="processedImage && !isProcessing" class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h4 class="font-bold text-gray-800 dark:text-white mb-3 text-center">
                            <i class="fa-solid fa-palette text-cyan-500 mr-2"></i>Set Background Color
                        </h4>
                        
                        <!-- Preset Colors -->
                        <div class="flex flex-wrap justify-center gap-2 mb-4">
                            <!-- Transparent -->
                            <button 
                                (click)="selectBgColor('transparent')"
                                class="w-10 h-10 rounded-lg border-2 transition-all hover:scale-110"
                                [class.ring-2]="selectedBgColor === 'transparent'"
                                [class.ring-cyan-500]="selectedBgColor === 'transparent'"
                                style="background: repeating-conic-gradient(#e5e5e5 0% 25%, #ffffff 0% 50%) 50% / 10px 10px;"
                                title="Transparent">
                            </button>
                            
                            <!-- Preset Colors -->
                            <button *ngFor="let color of presetColors"
                                (click)="selectBgColor(color)"
                                class="w-10 h-10 rounded-lg border-2 border-gray-300 transition-all hover:scale-110"
                                [class.ring-2]="selectedBgColor === color"
                                [class.ring-cyan-500]="selectedBgColor === color"
                                [style.backgroundColor]="color"
                                [title]="color">
                            </button>
                            
                            <!-- Custom Color Picker -->
                            <div class="relative">
                                <input 
                                    type="color" 
                                    [(ngModel)]="customColor"
                                    (change)="selectBgColor(customColor)"
                                    class="w-10 h-10 rounded-lg border-2 border-gray-300 cursor-pointer"
                                    title="Custom Color">
                            </div>
                        </div>
                        
                        <p class="text-xs text-gray-500 dark:text-gray-400 text-center">
                            Selected: {{ selectedBgColor === 'transparent' ? 'Transparent (PNG)' : selectedBgColor }}
                        </p>
                    </div>

                    <!-- Action Buttons -->
                    <div *ngIf="!isProcessing" class="flex flex-col md:flex-row gap-4 justify-center mt-6">
                        <button *ngIf="!processedImage" (click)="removeBackground()" 
                                class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-bold hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center gap-2 shadow-lg">
                            <i class="fa-solid fa-eraser"></i> Remove Background
                        </button>
                        
                        <button *ngIf="processedImage" (click)="downloadProcessed()" 
                                class="px-6 py-3 bg-green-500 justify-center align-center text-white rounded-lg font-bold hover:bg-green-600 transition-colors flex items-center gap-2 shadow-lg">
                            <i class="fa-solid fa-download"></i> 
                            {{ selectedBgColor === 'transparent' ? 'Download PNG' : 'Download with Background' }}
                        </button>
                        
                        <!-- Send to Tool -->
                        <app-send-to-tool *ngIf="processedImage"
                            [hasOutput]="!!processedImage"
                            [currentRoute]="currentRoute"
                            [outputData]="processedImage"
                            [fileName]="getOutputFileName()"
                            [fileType]="'image'">
                        </app-send-to-tool>
                        
                        <button (click)="reset()" 
                                class="px-6 py-3 justify-center align-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
                            <i class="fa-solid fa-rotate"></i> Try Another
                        </button>
                    </div>
                </div>

                <!-- Info Section -->
                <div class="mt-8 grid md:grid-cols-3 gap-4">
                    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
                        <i class="fa-solid fa-magic text-cyan-500 text-2xl mb-2"></i>
                        <h4 class="font-bold text-gray-800 dark:text-white">Automatic</h4>
                        <p class="text-gray-500 text-sm">No manual selection needed</p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
                        <i class="fa-solid fa-palette text-cyan-500 text-2xl mb-2"></i>
                        <h4 class="font-bold text-gray-800 dark:text-white">Custom Background</h4>
                        <p class="text-gray-500 text-sm">Add any color background</p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow text-center">
                        <i class="fa-solid fa-robot text-cyan-500 text-2xl mb-2"></i>
                        <h4 class="font-bold text-gray-800 dark:text-white">AI Powered</h4>
                        <p class="text-gray-500 text-sm">Advanced neural network</p>
                    </div>
                </div>

            </div>
        </div>
    </div>
  `
})
export class RemoveBgComponent implements OnInit {
    originalImage: string | null = null;
    processedImage: string | null = null;
    originalFileName = '';
    isProcessing = false;
    error = '';
    currentRoute = '/image/remove-bg';

    // Background color options
    selectedBgColor = 'transparent';
    customColor = '#ffffff';
    presetColors = [
        '#ffffff', // White
        '#000000', // Black
        '#f43f5e', // Red
        '#22c55e', // Green
        '#3b82f6', // Blue
        '#eab308', // Yellow
        '#a855f7', // Purple
        '#ec4899', // Pink
        '#06b6d4', // Cyan
        '#f97316'  // Orange
    ];

    private apiUrl = environment.apiUrl;
    constructor(
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone,
        private workspaceService: WorkspaceService,
        private scriptLoader: ScriptLoaderService,
        private analyticsService: AnalyticsService
    ) { }

    async ngOnInit(): Promise<void> {
        await this.scriptLoader.load(['file-saver']);

        if (this.workspaceService.hasFile()) {
            const file = this.workspaceService.getFile();
            if (file && file.fileType === 'image') {
                this.originalImage = file.data;
                this.originalFileName = file.fileName;
                this.cdr.detectChanges();
            }
        }
    }

    getOutputFileName(): string {
        return this.originalFileName.replace(/\.[^/.]+$/, '') + '_nobg.png';
    }

    onFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.handleFile(input.files[0]);
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
        if (event.dataTransfer?.files[0]) {
            this.handleFile(event.dataTransfer.files[0]);
        }
    }

    handleFile(file: File) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        this.originalFileName = file.name;
        this.processedImage = null;
        this.error = '';
        this.selectedBgColor = 'transparent';

        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.originalImage = e.target.result;
            this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
    }

    selectBgColor(color: string) {
        this.selectedBgColor = color;
        this.cdr.detectChanges();
    }

    async removeBackground() {
        if (!this.originalImage) return;

        this.isProcessing = true;
        this.error = '';
        this.cdr.detectChanges();

        try {
            const response = await fetch(`${this.apiUrl}/rembg/remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image: this.originalImage,
                    model: 'isnet-general-use'
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Background removal failed');
            }

            this.ngZone.run(() => {
                this.processedImage = result.processed;
                this.isProcessing = false;
                this.analyticsService.trackToolUsage('remove-bg', 'Remove Background', 'image');
                this.cdr.detectChanges();
            });

        } catch (error: any) {
            console.error('Background removal error:', error);
            this.ngZone.run(() => {
                this.error = error.message || 'Failed to remove background';
                this.isProcessing = false;
                this.cdr.detectChanges();
            });
        }
    }

    downloadProcessed() {
        if (!this.processedImage) return;

        if (this.selectedBgColor === 'transparent') {
            // Download as transparent PNG
            this.downloadTransparentPng();
        } else {
            // Download with colored background
            this.downloadWithBackground();
        }
    }

    private downloadTransparentPng() {
        const base64Data = this.processedImage!.replace(/^data:image\/\w+;base64,/, '');
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });

        const fileName = this.originalFileName.replace(/\.[^/.]+$/, '') + '_nobg.png';
        saveAs(blob, fileName);
    }

    private downloadWithBackground() {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d')!;

            // Fill with selected background color
            ctx.fillStyle = this.selectedBgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw the transparent image on top
            ctx.drawImage(img, 0, 0);

            // Convert to blob and download
            canvas.toBlob((blob) => {
                if (blob) {
                    const fileName = this.originalFileName.replace(/\.[^/.]+$/, '') + '_colored_bg.png';
                    saveAs(blob, fileName);
                }
            }, 'image/png');
        };
        img.src = this.processedImage!;
    }

    reset() {
        this.originalImage = null;
        this.processedImage = null;
        this.originalFileName = '';
        this.error = '';
        this.selectedBgColor = 'transparent';
    }
}
