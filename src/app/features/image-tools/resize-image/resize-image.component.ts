import { Component, ChangeDetectorRef, inject, NgZone, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { SeoService } from '../../../core/services/seo.service';

interface PresetSize {
    name: string;
    width: number;
    height: number;
}

type ResizeMode = 'stretch' | 'crop' | 'fit';

@Component({
    selector: 'app-resize-image',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    templateUrl: './resize-image.component.html',
    styleUrls: ['./resize-image.component.scss']
})
export class ResizeImageComponent implements OnInit, AfterViewInit {
    @ViewChild('positionCanvas') positionCanvasRef!: ElementRef<HTMLCanvasElement>;

    private cdr = inject(ChangeDetectorRef);
    private ngZone = inject(NgZone);
    private apiUrl = environment.apiUrl;
    private workspaceService = inject(WorkspaceService);
    private analyticsService = inject(AnalyticsService);
    private seoService = inject(SeoService);

    currentRoute = '/image/resize';

    // Image state
    originalImage: string | null = null;
    resizedImage: string | null = null;
    originalFileName = '';
    originalWidth = 0;
    originalHeight = 0;
    private loadedImage: HTMLImageElement | null = null;

    // Resize controls
    targetWidth = 0;
    targetHeight = 0;
    aspectRatioLocked = true;
    private originalAspectRatio = 1;

    // Resize mode (stretch, crop, fit)
    resizeMode: ResizeMode = 'stretch';
    showResizeModes = false;
    fitBackgroundColor = '#000000';

    // Position controls for Crop/Fit
    showPositionEditor = false;
    imageOffsetX = 0;
    imageOffsetY = 0;
    private isDragging = false;
    private dragStartX = 0;
    private dragStartY = 0;
    private initialOffsetX = 0;
    private initialOffsetY = 0;
    private previewScale = 1;

    // AI Upscale option
    useAiUpscale = false;
    isUpscaling = false;

    // Processing state
    isProcessing = false;
    error = '';

    // Preset sizes
    presets: PresetSize[] = [
        { name: 'Instagram Square', width: 1080, height: 1080 },
        { name: 'Instagram Portrait', width: 1080, height: 1350 },
        { name: 'Instagram Story', width: 1080, height: 1920 },
        { name: 'Facebook Cover', width: 820, height: 312 },
        { name: 'Twitter Header', width: 1500, height: 500 },
        { name: 'YouTube Thumbnail', width: 1280, height: 720 },
        { name: 'Full HD', width: 1920, height: 1080 },
        { name: '4K UHD', width: 3840, height: 2160 },
        { name: 'HD', width: 1280, height: 720 },
        { name: 'Square 500', width: 500, height: 500 }
    ];

    ngOnInit(): void {
        this.seoService.updateSeo({
            title: 'Resize Image Online - Free Image Resizer',
            description: 'Resize images online for free. Change dimensions of JPG, PNG, and WebP images. Crop or resize for Instagram, Facebook, and more.',
            keywords: 'resize image, online image resizer, photo resizer, change image size, crop image, resize for instagram',
            url: 'https://2olhub.netlify.app/image/resize'
        });
        this.seoService.setFaqJsonLd([
            { question: 'Will making an image bigger hurt quality?', answer: 'Smaller preserves quality fully. Going bigger with standard resize introduces some softness, but AI upscale reconstructs detail instead of just stretching.' },
            { question: 'What\'s the difference between Stretch, Crop, and Fit?', answer: 'Stretch fills the target size but can distort. Crop scales to fill and trims overflow. Fit scales inside the frame with background padding — nothing lost.' },
            { question: 'Can I position where the image sits in the frame?', answer: 'Yes — in Crop and Fit modes, you can drag the image to choose exactly which part is visible or how it\'s positioned.' },
            { question: 'What formats does this support?', answer: 'JPG, PNG, and WebP for both input and output. The resized file comes out in the same format as the original.' },
            { question: 'Is there a max image size?', answer: 'No hard limit — it handles whatever your browser can manage. Very large images might take a few extra seconds.' }
        ]);

        // Check if there's an image from another tool
        if (this.workspaceService.hasFile()) {
            const file = this.workspaceService.getFile();
            if (file && file.fileType === 'image') {
                this.loadImageFromWorkspace(file.data, file.fileName);
            }
        }
    }

    ngAfterViewInit(): void {
        // Canvas will be set up when needed
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.handleFile(input.files[0]);
        }
        input.value = '';
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer?.files[0]) {
            this.handleFile(event.dataTransfer.files[0]);
        }
    }

    private handleFile(file: File): void {
        if (!file.type.startsWith('image/')) {
            this.error = 'Please select an image file';
            return;
        }

        this.originalFileName = file.name;
        this.resizedImage = null;
        this.error = '';

        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.originalImage = e.target.result;

            // Get original dimensions
            const img = new Image();
            img.onload = () => {
                this.loadedImage = img;
                this.originalWidth = img.width;
                this.originalHeight = img.height;
                this.targetWidth = img.width;
                this.targetHeight = img.height;
                this.originalAspectRatio = img.width / img.height;
                this.checkResizeOptions();
                this.cdr.detectChanges();
            };
            img.src = e.target.result;

            this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
    }

    private loadImageFromWorkspace(dataUrl: string, fileName: string): void {
        this.originalFileName = fileName;
        this.resizedImage = null;
        this.error = '';
        this.originalImage = dataUrl;

        const img = new Image();
        img.onload = () => {
            this.loadedImage = img;
            this.originalWidth = img.width;
            this.originalHeight = img.height;
            this.targetWidth = img.width;
            this.targetHeight = img.height;
            this.originalAspectRatio = img.width / img.height;
            this.checkResizeOptions();
            this.cdr.detectChanges();
        };
        img.src = dataUrl;
        this.cdr.detectChanges();
    }

    onWidthChange(): void {
        if (this.aspectRatioLocked && this.targetWidth > 0) {
            this.targetHeight = Math.round(this.targetWidth / this.originalAspectRatio);
        }
        this.resizedImage = null;
        this.showPositionEditor = false;
        this.checkResizeOptions();
    }

    onHeightChange(): void {
        if (this.aspectRatioLocked && this.targetHeight > 0) {
            this.targetWidth = Math.round(this.targetHeight * this.originalAspectRatio);
        }
        this.resizedImage = null;
        this.showPositionEditor = false;
        this.checkResizeOptions();
    }

    toggleAspectRatio(): void {
        this.aspectRatioLocked = !this.aspectRatioLocked;
        this.checkResizeOptions();
    }

    applyPreset(preset: PresetSize): void {
        this.targetWidth = preset.width;
        this.targetHeight = preset.height;
        this.aspectRatioLocked = false;
        this.resizedImage = null;
        this.showPositionEditor = false;
        this.checkResizeOptions();
        this.cdr.detectChanges();
    }

    private checkResizeOptions(): void {
        const targetAspectRatio = this.targetWidth / this.targetHeight;
        const aspectDiff = Math.abs(targetAspectRatio - this.originalAspectRatio);

        this.showResizeModes = !this.aspectRatioLocked && aspectDiff > 0.01;

        const targetPixels = this.targetWidth * this.targetHeight;
        const originalPixels = this.originalWidth * this.originalHeight;
        this.isUpscaling = targetPixels > originalPixels * 1.5;
    }

    setResizeMode(mode: ResizeMode): void {
        this.resizeMode = mode;
        this.resizedImage = null;
        this.showPositionEditor = false;
        this.imageOffsetX = 0;
        this.imageOffsetY = 0;
    }

    // Open position editor for Crop/Fit modes
    openPositionEditor(): void {
        if ((this.resizeMode === 'crop' || this.resizeMode === 'fit') && this.showResizeModes) {
            this.showPositionEditor = true;
            this.imageOffsetX = 0;
            this.imageOffsetY = 0;
            this.cdr.detectChanges();

            // Wait for canvas to be available
            setTimeout(() => this.drawPositionPreview(), 50);
        } else {
            // For stretch mode or same aspect ratio, directly resize
            this.resizeImage();
        }
    }

    private drawPositionPreview(): void {
        const canvas = this.positionCanvasRef?.nativeElement;
        if (!canvas || !this.loadedImage) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Calculate preview size to fit in container (max 400px)
        const maxPreviewSize = 400;
        this.previewScale = Math.min(
            maxPreviewSize / this.targetWidth,
            maxPreviewSize / this.targetHeight,
            1
        );

        const previewWidth = this.targetWidth * this.previewScale;
        const previewHeight = this.targetHeight * this.previewScale;

        canvas.width = previewWidth;
        canvas.height = previewHeight;

        // Clear canvas
        ctx.fillStyle = this.resizeMode === 'fit' ? this.fitBackgroundColor : '#333';
        ctx.fillRect(0, 0, previewWidth, previewHeight);

        // Calculate image draw parameters
        const img = this.loadedImage;
        let imgWidth: number, imgHeight: number;

        if (this.resizeMode === 'crop') {
            // For crop: image should cover the canvas
            const srcRatio = img.width / img.height;
            const dstRatio = this.targetWidth / this.targetHeight;

            if (srcRatio > dstRatio) {
                imgHeight = previewHeight;
                imgWidth = imgHeight * srcRatio;
            } else {
                imgWidth = previewWidth;
                imgHeight = imgWidth / srcRatio;
            }
        } else {
            // For fit: image should fit inside
            const srcRatio = img.width / img.height;
            const dstRatio = this.targetWidth / this.targetHeight;

            if (srcRatio > dstRatio) {
                imgWidth = previewWidth;
                imgHeight = imgWidth / srcRatio;
            } else {
                imgHeight = previewHeight;
                imgWidth = imgHeight * srcRatio;
            }
        }

        // Apply offset and draw
        const offsetX = this.imageOffsetX * this.previewScale;
        const offsetY = this.imageOffsetY * this.previewScale;

        const x = (previewWidth - imgWidth) / 2 + offsetX;
        const y = (previewHeight - imgHeight) / 2 + offsetY;

        ctx.drawImage(img, x, y, imgWidth, imgHeight);

        // Draw frame border
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, previewWidth - 2, previewHeight - 2);
    }

    // Mouse/touch event handlers for dragging
    onCanvasMouseDown(event: MouseEvent): void {
        this.isDragging = true;
        this.dragStartX = event.clientX;
        this.dragStartY = event.clientY;
        this.initialOffsetX = this.imageOffsetX;
        this.initialOffsetY = this.imageOffsetY;
    }

    onCanvasMouseMove(event: MouseEvent): void {
        if (!this.isDragging) return;

        const deltaX = (event.clientX - this.dragStartX) / this.previewScale;
        const deltaY = (event.clientY - this.dragStartY) / this.previewScale;

        this.imageOffsetX = this.initialOffsetX + deltaX;
        this.imageOffsetY = this.initialOffsetY + deltaY;

        this.drawPositionPreview();
    }

    onCanvasMouseUp(): void {
        this.isDragging = false;
    }

    onCanvasMouseLeave(): void {
        this.isDragging = false;
    }

    // Touch events for mobile
    onCanvasTouchStart(event: TouchEvent): void {
        if (event.touches.length === 1) {
            event.preventDefault();
            this.isDragging = true;
            this.dragStartX = event.touches[0].clientX;
            this.dragStartY = event.touches[0].clientY;
            this.initialOffsetX = this.imageOffsetX;
            this.initialOffsetY = this.imageOffsetY;
        }
    }

    onCanvasTouchMove(event: TouchEvent): void {
        if (!this.isDragging || event.touches.length !== 1) return;
        event.preventDefault();

        const deltaX = (event.touches[0].clientX - this.dragStartX) / this.previewScale;
        const deltaY = (event.touches[0].clientY - this.dragStartY) / this.previewScale;

        this.imageOffsetX = this.initialOffsetX + deltaX;
        this.imageOffsetY = this.initialOffsetY + deltaY;

        this.drawPositionPreview();
    }

    onCanvasTouchEnd(): void {
        this.isDragging = false;
    }

    cancelPositionEditor(): void {
        this.showPositionEditor = false;
        this.imageOffsetX = 0;
        this.imageOffsetY = 0;
    }

    async confirmPosition(): Promise<void> {
        this.showPositionEditor = false;
        this.cdr.detectChanges();

        // Slight delay to allow modal to close before processing
        await new Promise(resolve => setTimeout(resolve, 100));
        await this.resizeImage();
    }

    async resizeImage(): Promise<void> {
        if (!this.originalImage || this.targetWidth <= 0 || this.targetHeight <= 0) return;

        this.isProcessing = true;
        this.error = '';
        this.resizedImage = null;
        this.cdr.detectChanges();

        try {
            let sourceImage = this.originalImage;

            if (this.useAiUpscale && this.isUpscaling) {
                console.log('🤖 Using AI upscaling...');
                const response = await fetch(`${this.apiUrl}/enhance/image`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: this.originalImage })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'AI upscaling failed');
                sourceImage = data.enhanced;
                console.log('✅ AI upscaling complete');
            }

            const result = await this.processResize(sourceImage);

            this.ngZone.run(() => {
                this.resizedImage = result;
                this.isProcessing = false;
                this.analyticsService.trackToolUsage('resize-image', 'Resize Image', 'image');
                this.cdr.detectChanges();
            });
        } catch (err: any) {
            this.ngZone.run(() => {
                this.error = err.message || 'Failed to resize image';
                this.isProcessing = false;
                this.cdr.detectChanges();
            });
        }
    }

    private processResize(src: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = this.targetWidth;
                    canvas.height = this.targetHeight;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Canvas context not supported'));
                        return;
                    }

                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';

                    if (this.resizeMode === 'stretch') {
                        // Simple stretch
                        ctx.drawImage(img, 0, 0, this.targetWidth, this.targetHeight);
                    } else if (this.resizeMode === 'crop') {
                        // Crop with custom offset
                        const srcRatio = img.width / img.height;
                        const dstRatio = this.targetWidth / this.targetHeight;

                        let imgWidth: number, imgHeight: number;
                        if (srcRatio > dstRatio) {
                            imgHeight = this.targetHeight;
                            imgWidth = imgHeight * srcRatio;
                        } else {
                            imgWidth = this.targetWidth;
                            imgHeight = imgWidth / srcRatio;
                        }

                        const x = (this.targetWidth - imgWidth) / 2 + this.imageOffsetX;
                        const y = (this.targetHeight - imgHeight) / 2 + this.imageOffsetY;

                        ctx.drawImage(img, x, y, imgWidth, imgHeight);
                    } else if (this.resizeMode === 'fit') {
                        // Fit with background and custom offset
                        ctx.fillStyle = this.fitBackgroundColor;
                        ctx.fillRect(0, 0, this.targetWidth, this.targetHeight);

                        const srcRatio = img.width / img.height;
                        const dstRatio = this.targetWidth / this.targetHeight;

                        let imgWidth: number, imgHeight: number;
                        if (srcRatio > dstRatio) {
                            imgWidth = this.targetWidth;
                            imgHeight = imgWidth / srcRatio;
                        } else {
                            imgHeight = this.targetHeight;
                            imgWidth = imgHeight * srcRatio;
                        }

                        const x = (this.targetWidth - imgWidth) / 2 + this.imageOffsetX;
                        const y = (this.targetHeight - imgHeight) / 2 + this.imageOffsetY;

                        ctx.drawImage(img, x, y, imgWidth, imgHeight);
                    }

                    const isPng = src.includes('image/png');
                    const outputType = isPng ? 'image/png' : 'image/jpeg';
                    const quality = isPng ? undefined : 0.92;

                    resolve(canvas.toDataURL(outputType, quality));
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = src;
        });
    }

    downloadResized(): void {
        if (!this.resizedImage) return;

        const link = document.createElement('a');
        link.href = this.resizedImage;

        const ext = this.resizedImage.includes('image/png') ? 'png' : 'jpg';
        const baseName = this.originalFileName.replace(/\.[^.]+$/, '');
        link.download = `${baseName}_${this.targetWidth}x${this.targetHeight}.${ext}`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    reset(): void {
        this.originalImage = null;
        this.resizedImage = null;
        this.originalFileName = '';
        this.originalWidth = 0;
        this.originalHeight = 0;
        this.targetWidth = 0;
        this.targetHeight = 0;
        this.aspectRatioLocked = true;
        this.resizeMode = 'stretch';
        this.showResizeModes = false;
        this.showPositionEditor = false;
        this.imageOffsetX = 0;
        this.imageOffsetY = 0;
        this.useAiUpscale = false;
        this.isUpscaling = false;
        this.error = '';
        this.loadedImage = null;
    }

    formatDimensions(width: number, height: number): string {
        return `${width} × ${height}`;
    }

    getScaleFactor(): string {
        if (this.originalWidth === 0 || this.originalHeight === 0) return '1x';
        const factor = Math.sqrt((this.targetWidth * this.targetHeight) / (this.originalWidth * this.originalHeight));
        return factor.toFixed(1) + 'x';
    }
}
