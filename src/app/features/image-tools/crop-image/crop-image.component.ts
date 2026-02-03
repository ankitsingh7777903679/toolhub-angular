import { Component, ChangeDetectorRef, inject, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { AnalyticsService } from '../../../core/services/analytics.service';

interface AspectRatioPreset {
    name: string;
    ratio: number | null; // null means free
}

@Component({
    selector: 'app-crop-image',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    templateUrl: './crop-image.component.html',
    styleUrls: ['./crop-image.component.scss']
})
export class CropImageComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('cropCanvas') cropCanvasRef!: ElementRef<HTMLCanvasElement>;
    @ViewChild('imageContainer') imageContainerRef!: ElementRef<HTMLDivElement>;

    private cdr = inject(ChangeDetectorRef);
    private workspaceService = inject(WorkspaceService);
    private analyticsService = inject(AnalyticsService);

    currentRoute = '/image/crop';

    // Image state
    originalImage: string | null = null;
    croppedImage: string | null = null;
    originalCropPreview: string | null = null;
    originalFileName = '';
    imageWidth = 0;
    imageHeight = 0;
    private loadedImage: HTMLImageElement | null = null;

    // Display dimensions (scaled to fit container)
    displayWidth = 0;
    displayHeight = 0;
    private displayScale = 1;

    // Crop box (in display coordinates)
    cropX = 0;
    cropY = 0;
    cropWidth = 0;
    cropHeight = 0;

    // Aspect ratio
    aspectRatioLocked = false;
    selectedAspectRatio: number | null = null;

    aspectRatioPresets: AspectRatioPreset[] = [
        { name: 'Free', ratio: null },
        { name: '1:1', ratio: 1 },
        { name: '4:3', ratio: 4 / 3 },
        { name: '16:9', ratio: 16 / 9 },
        { name: '3:2', ratio: 3 / 2 },
        { name: '2:3', ratio: 2 / 3 },
        { name: '9:16', ratio: 9 / 16 }
    ];

    // Drag state
    private isDragging = false;
    private isResizing = false;
    private resizeHandle = '';
    private dragStartX = 0;
    private dragStartY = 0;
    private initialCropX = 0;
    private initialCropY = 0;
    private initialCropWidth = 0;
    private initialCropHeight = 0;

    // Processing state
    isProcessing = false;
    error = '';

    // Comparison slider
    comparisonSlider = 50;
    comparisonWidth = 300;
    comparisonHeight = 200;
    private isSliderDragging = false;
    private sliderContainerRect: DOMRect | null = null;

    // Bound event handlers for cleanup
    private boundMouseMove = this.onMouseMove.bind(this);
    private boundMouseUp = this.onMouseUp.bind(this);
    private boundTouchMove = this.onTouchMove.bind(this);
    private boundTouchEnd = this.onTouchEnd.bind(this);

    ngOnInit(): void {
        // Check if there's an image from another tool
        if (this.workspaceService.hasFile()) {
            const file = this.workspaceService.getFile();
            if (file && file.fileType === 'image') {
                this.loadImageFromWorkspace(file.data, file.fileName);
            }
        }
    }

    ngAfterViewInit(): void {
        // Add global listeners for drag operations
        document.addEventListener('mousemove', this.boundMouseMove);
        document.addEventListener('mouseup', this.boundMouseUp);
        document.addEventListener('touchmove', this.boundTouchMove, { passive: false });
        document.addEventListener('touchend', this.boundTouchEnd);
    }

    ngOnDestroy(): void {
        document.removeEventListener('mousemove', this.boundMouseMove);
        document.removeEventListener('mouseup', this.boundMouseUp);
        document.removeEventListener('touchmove', this.boundTouchMove);
        document.removeEventListener('touchend', this.boundTouchEnd);
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
        this.croppedImage = null;
        this.error = '';

        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.originalImage = e.target.result;

            const img = new Image();
            img.onload = () => {
                this.loadedImage = img;
                this.imageWidth = img.width;
                this.imageHeight = img.height;

                // Calculate display dimensions
                this.calculateDisplayDimensions();

                // Initialize crop box to full image
                this.initializeCropBox();

                this.cdr.detectChanges();
            };
            img.src = e.target.result;

            this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
    }

    private loadImageFromWorkspace(dataUrl: string, fileName: string): void {
        this.originalFileName = fileName;
        this.croppedImage = null;
        this.error = '';
        this.originalImage = dataUrl;

        const img = new Image();
        img.onload = () => {
            this.loadedImage = img;
            this.imageWidth = img.width;
            this.imageHeight = img.height;

            this.calculateDisplayDimensions();
            this.initializeCropBox();

            this.cdr.detectChanges();
        };
        img.src = dataUrl;
        this.cdr.detectChanges();
    }

    private calculateDisplayDimensions(): void {
        const maxWidth = 400;
        const maxHeight = 300;

        const widthRatio = maxWidth / this.imageWidth;
        const heightRatio = maxHeight / this.imageHeight;
        this.displayScale = Math.min(widthRatio, heightRatio, 1);

        this.displayWidth = Math.round(this.imageWidth * this.displayScale);
        this.displayHeight = Math.round(this.imageHeight * this.displayScale);
    }

    private initializeCropBox(): void {
        // Start with crop covering 80% of image, centered
        const margin = 0.1;
        this.cropX = this.displayWidth * margin;
        this.cropY = this.displayHeight * margin;
        this.cropWidth = this.displayWidth * (1 - 2 * margin);
        this.cropHeight = this.displayHeight * (1 - 2 * margin);

        // Apply aspect ratio if locked
        if (this.selectedAspectRatio !== null) {
            this.applyAspectRatioToInitialCrop();
        }
    }

    private applyAspectRatioToInitialCrop(): void {
        if (this.selectedAspectRatio === null) return;

        const currentRatio = this.cropWidth / this.cropHeight;
        const targetRatio = this.selectedAspectRatio;

        if (currentRatio > targetRatio) {
            // Too wide, reduce width
            const newWidth = this.cropHeight * targetRatio;
            this.cropX += (this.cropWidth - newWidth) / 2;
            this.cropWidth = newWidth;
        } else {
            // Too tall, reduce height
            const newHeight = this.cropWidth / targetRatio;
            this.cropY += (this.cropHeight - newHeight) / 2;
            this.cropHeight = newHeight;
        }
    }

    setAspectRatio(ratio: number | null): void {
        this.selectedAspectRatio = ratio;
        this.aspectRatioLocked = ratio !== null;

        if (ratio !== null && this.loadedImage) {
            this.applyAspectRatioToInitialCrop();
            this.constrainCropBox();
        }

        this.croppedImage = null;
        this.cdr.detectChanges();
    }

    // Mouse/Touch event handlers for crop box
    onCropBoxMouseDown(event: MouseEvent): void {
        event.preventDefault();
        this.startDrag(event.clientX, event.clientY);
    }

    onCropBoxTouchStart(event: TouchEvent): void {
        if (event.touches.length === 1) {
            event.preventDefault();
            this.startDrag(event.touches[0].clientX, event.touches[0].clientY);
        }
    }

    private startDrag(clientX: number, clientY: number): void {
        this.isDragging = true;
        this.isResizing = false;
        this.dragStartX = clientX;
        this.dragStartY = clientY;
        this.initialCropX = this.cropX;
        this.initialCropY = this.cropY;
    }

    onHandleMouseDown(event: MouseEvent, handle: string): void {
        event.preventDefault();
        event.stopPropagation();
        this.startResize(event.clientX, event.clientY, handle);
    }

    onHandleTouchStart(event: TouchEvent, handle: string): void {
        if (event.touches.length === 1) {
            event.preventDefault();
            event.stopPropagation();
            this.startResize(event.touches[0].clientX, event.touches[0].clientY, handle);
        }
    }

    private startResize(clientX: number, clientY: number, handle: string): void {
        this.isResizing = true;
        this.isDragging = false;
        this.resizeHandle = handle;
        this.dragStartX = clientX;
        this.dragStartY = clientY;
        this.initialCropX = this.cropX;
        this.initialCropY = this.cropY;
        this.initialCropWidth = this.cropWidth;
        this.initialCropHeight = this.cropHeight;
    }

    private onMouseMove(event: MouseEvent): void {
        if (!this.isDragging && !this.isResizing) return;
        this.handleMove(event.clientX, event.clientY);
    }

    private onTouchMove(event: TouchEvent): void {
        if (!this.isDragging && !this.isResizing) return;
        if (event.touches.length === 1) {
            event.preventDefault();
            this.handleMove(event.touches[0].clientX, event.touches[0].clientY);
        }
    }

    private handleMove(clientX: number, clientY: number): void {
        const deltaX = clientX - this.dragStartX;
        const deltaY = clientY - this.dragStartY;

        if (this.isDragging) {
            this.cropX = this.initialCropX + deltaX;
            this.cropY = this.initialCropY + deltaY;
            this.constrainCropBox();
        } else if (this.isResizing) {
            this.resizeCropBox(deltaX, deltaY);
        }

        this.cdr.detectChanges();
    }

    private resizeCropBox(deltaX: number, deltaY: number): void {
        const minSize = 50;
        let newX = this.initialCropX;
        let newY = this.initialCropY;
        let newWidth = this.initialCropWidth;
        let newHeight = this.initialCropHeight;

        // Handle horizontal resizing
        if (this.resizeHandle.includes('w')) {
            newX = this.initialCropX + deltaX;
            newWidth = this.initialCropWidth - deltaX;
        } else if (this.resizeHandle.includes('e')) {
            newWidth = this.initialCropWidth + deltaX;
        }

        // Handle vertical resizing
        if (this.resizeHandle.includes('n')) {
            newY = this.initialCropY + deltaY;
            newHeight = this.initialCropHeight - deltaY;
        } else if (this.resizeHandle.includes('s')) {
            newHeight = this.initialCropHeight + deltaY;
        }

        // Apply aspect ratio constraint
        if (this.selectedAspectRatio !== null) {
            const ratio = this.selectedAspectRatio;

            if (this.resizeHandle === 'n' || this.resizeHandle === 's') {
                // Adjust width based on height
                const adjustedWidth = newHeight * ratio;
                const widthDiff = adjustedWidth - newWidth;
                newX -= widthDiff / 2;
                newWidth = adjustedWidth;
            } else if (this.resizeHandle === 'e' || this.resizeHandle === 'w') {
                // Adjust height based on width
                const adjustedHeight = newWidth / ratio;
                const heightDiff = adjustedHeight - newHeight;
                newY -= heightDiff / 2;
                newHeight = adjustedHeight;
            } else {
                // Corner resize: use the larger dimension change
                const widthFromHeight = newHeight * ratio;
                const heightFromWidth = newWidth / ratio;

                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    newHeight = heightFromWidth;
                    if (this.resizeHandle.includes('n')) {
                        newY = this.initialCropY + this.initialCropHeight - newHeight;
                    }
                } else {
                    newWidth = widthFromHeight;
                    if (this.resizeHandle.includes('w')) {
                        newX = this.initialCropX + this.initialCropWidth - newWidth;
                    }
                }
            }
        }

        // Enforce minimum size
        if (newWidth >= minSize && newHeight >= minSize) {
            this.cropX = newX;
            this.cropY = newY;
            this.cropWidth = newWidth;
            this.cropHeight = newHeight;
            this.constrainCropBox();
        }
    }

    private constrainCropBox(): void {
        // Keep crop box within bounds
        if (this.cropX < 0) this.cropX = 0;
        if (this.cropY < 0) this.cropY = 0;
        if (this.cropX + this.cropWidth > this.displayWidth) {
            this.cropX = this.displayWidth - this.cropWidth;
        }
        if (this.cropY + this.cropHeight > this.displayHeight) {
            this.cropY = this.displayHeight - this.cropHeight;
        }

        // Ensure dimensions don't exceed image
        if (this.cropWidth > this.displayWidth) {
            this.cropWidth = this.displayWidth;
            this.cropX = 0;
        }
        if (this.cropHeight > this.displayHeight) {
            this.cropHeight = this.displayHeight;
            this.cropY = 0;
        }
    }

    private onMouseUp(): void {
        this.isDragging = false;
        this.isResizing = false;
    }

    private onTouchEnd(): void {
        this.isDragging = false;
        this.isResizing = false;
    }

    async cropImage(): Promise<void> {
        if (!this.loadedImage) return;

        this.isProcessing = true;
        this.error = '';
        this.croppedImage = null;
        this.cdr.detectChanges();

        try {
            // Convert display coordinates to actual image coordinates
            const actualX = Math.round(this.cropX / this.displayScale);
            const actualY = Math.round(this.cropY / this.displayScale);
            const actualWidth = Math.round(this.cropWidth / this.displayScale);
            const actualHeight = Math.round(this.cropHeight / this.displayScale);

            const canvas = document.createElement('canvas');
            canvas.width = actualWidth;
            canvas.height = actualHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Canvas context not supported');
            }

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Draw the cropped portion
            ctx.drawImage(
                this.loadedImage,
                actualX, actualY, actualWidth, actualHeight,
                0, 0, actualWidth, actualHeight
            );

            // Determine output format
            const isPng = this.originalImage?.includes('image/png');
            const outputType = isPng ? 'image/png' : 'image/jpeg';
            const quality = isPng ? undefined : 0.92;

            this.croppedImage = canvas.toDataURL(outputType, quality);

            // Generate preview of same area from original for comparison
            this.generateOriginalCropPreview(actualX, actualY, actualWidth, actualHeight);

            this.calculateComparisonDimensions(actualWidth, actualHeight);
            this.comparisonSlider = 50;
            this.isProcessing = false;
            this.analyticsService.trackToolUsage('crop-image', 'Crop Image', 'image');
            this.cdr.detectChanges();
        } catch (err: any) {
            this.error = err.message || 'Failed to crop image';
            this.isProcessing = false;
            this.cdr.detectChanges();
        }
    }

    downloadCropped(): void {
        if (!this.croppedImage) return;

        // Convert data URL to Blob for better download handling
        const dataUrl = this.croppedImage;
        const byteString = atob(dataUrl.split(',')[1]);
        const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeType });
        const blobUrl = URL.createObjectURL(blob);

        const ext = mimeType.includes('png') ? 'png' : 'jpg';
        const baseName = this.originalFileName.replace(/\.[^.]+$/, '') || 'image';

        // Get actual crop dimensions for filename
        const actualWidth = Math.round(this.cropWidth / this.displayScale);
        const actualHeight = Math.round(this.cropHeight / this.displayScale);
        const filename = `${baseName}_cropped_${actualWidth}x${actualHeight}.${ext}`;

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();

        // Delay cleanup significantly to ensure download completes (especially in incognito)
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        }, 5000);
    }

    reset(): void {
        this.originalImage = null;
        this.croppedImage = null;
        this.originalFileName = '';
        this.imageWidth = 0;
        this.imageHeight = 0;
        this.displayWidth = 0;
        this.displayHeight = 0;
        this.cropX = 0;
        this.cropY = 0;
        this.cropWidth = 0;
        this.cropHeight = 0;
        this.aspectRatioLocked = false;
        this.selectedAspectRatio = null;
        this.error = '';
        this.loadedImage = null;
        this.comparisonSlider = 50;
        this.originalCropPreview = null;
    }

    formatDimensions(width: number, height: number): string {
        return `${Math.round(width)} × ${Math.round(height)}`;
    }

    getCropDimensions(): string {
        const actualWidth = Math.round(this.cropWidth / this.displayScale);
        const actualHeight = Math.round(this.cropHeight / this.displayScale);
        return this.formatDimensions(actualWidth, actualHeight);
    }

    private calculateComparisonDimensions(cropWidth: number, cropHeight: number): void {
        const maxWidth = 280;
        const maxHeight = 220;

        const widthRatio = maxWidth / cropWidth;
        const heightRatio = maxHeight / cropHeight;
        const scale = Math.min(widthRatio, heightRatio, 1);

        this.comparisonWidth = Math.round(cropWidth * scale);
        this.comparisonHeight = Math.round(cropHeight * scale);
    }

    private generateOriginalCropPreview(x: number, y: number, width: number, height: number): void {
        if (!this.loadedImage) return;

        // Create a canvas showing the cropped area from the original image
        // This is the same as the cropped image for a simple crop tool
        // But we keep this separate in case we want to add filters/effects comparison later
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw the same cropped portion from original
        ctx.drawImage(
            this.loadedImage,
            x, y, width, height,
            0, 0, width, height
        );

        const isPng = this.originalImage?.includes('image/png');
        const outputType = isPng ? 'image/png' : 'image/jpeg';
        const quality = isPng ? undefined : 0.92;

        this.originalCropPreview = canvas.toDataURL(outputType, quality);
    }

    // Comparison slider event handlers
    onSliderMouseDown(event: MouseEvent): void {
        event.preventDefault();
        this.isSliderDragging = true;
        const container = (event.target as HTMLElement).closest('.comparison-container');
        if (container) {
            this.sliderContainerRect = container.getBoundingClientRect();
        }
        this.updateSliderPosition(event.clientX);

        // Add temporary global listeners
        document.addEventListener('mousemove', this.onSliderMove);
        document.addEventListener('mouseup', this.onSliderUp);
    }

    onSliderTouchStart(event: TouchEvent): void {
        if (event.touches.length === 1) {
            event.preventDefault();
            this.isSliderDragging = true;
            const container = (event.target as HTMLElement).closest('.comparison-container');
            if (container) {
                this.sliderContainerRect = container.getBoundingClientRect();
            }
            this.updateSliderPosition(event.touches[0].clientX);

            document.addEventListener('touchmove', this.onSliderTouchMove, { passive: false });
            document.addEventListener('touchend', this.onSliderTouchUp);
        }
    }

    private onSliderMove = (event: MouseEvent): void => {
        if (this.isSliderDragging) {
            this.updateSliderPosition(event.clientX);
        }
    };

    private onSliderTouchMove = (event: TouchEvent): void => {
        if (this.isSliderDragging && event.touches.length === 1) {
            event.preventDefault();
            this.updateSliderPosition(event.touches[0].clientX);
        }
    };

    private onSliderUp = (): void => {
        this.isSliderDragging = false;
        this.sliderContainerRect = null;
        document.removeEventListener('mousemove', this.onSliderMove);
        document.removeEventListener('mouseup', this.onSliderUp);
    };

    private onSliderTouchUp = (): void => {
        this.isSliderDragging = false;
        this.sliderContainerRect = null;
        document.removeEventListener('touchmove', this.onSliderTouchMove);
        document.removeEventListener('touchend', this.onSliderTouchUp);
    };

    private updateSliderPosition(clientX: number): void {
        if (!this.sliderContainerRect) return;

        const rect = this.sliderContainerRect;
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

        this.comparisonSlider = percentage;
        this.cdr.detectChanges();
    }
}
