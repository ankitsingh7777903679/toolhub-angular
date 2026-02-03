import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../shared/services/workspace.service';
import { SendToToolComponent } from '../../../shared/components/send-to-tool/send-to-tool.component';
import { AnalyticsService } from '../../../core/services/analytics.service';

declare const saveAs: any;

@Component({
    selector: 'app-blur-image',
    standalone: true,
    imports: [CommonModule, FormsModule, SendToToolComponent],
    templateUrl: './blur-image.component.html',
    styleUrl: './blur-image.component.scss'
})
export class BlurImageComponent implements OnInit {
    private cdr: ChangeDetectorRef;
    private workspaceService: WorkspaceService;
    currentRoute = '/image/blur';

    // Input image
    originalImage: string | null = null;
    originalFileName = '';

    // Blur settings
    blurType: 'gaussian' | 'motion' | 'radial' | 'pixelate' = 'gaussian';
    blurIntensity = 10; // 1-50

    // Motion blur specific
    motionAngle = 0;

    // Radial blur specific
    radialCenterX = 50;
    radialCenterY = 50;

    // Pixelate specific
    pixelSize = 10;

    // Result
    resultImage: string | null = null;
    isProcessing = false;

    // Preview (for live preview)
    previewImage: string | null = null;

    constructor(cdr: ChangeDetectorRef, workspaceService: WorkspaceService, private analyticsService: AnalyticsService) {
        this.cdr = cdr;
        this.workspaceService = workspaceService;
    }

    ngOnInit(): void {
        if (this.workspaceService.hasFile()) {
            const file = this.workspaceService.getFile();
            if (file && file.fileType === 'image') {
                this.originalImage = file.data;
                this.originalFileName = file.fileName;
                this.cdr.detectChanges();
            }
        }
    }

    onFileSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files?.[0]) {
            this.loadImage(input.files[0]);
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
        if (event.dataTransfer?.files?.[0]) {
            this.loadImage(event.dataTransfer.files[0]);
        }
    }

    private loadImage(file: File): void {
        if (!file.type.startsWith('image/')) return;
        this.originalFileName = file.name;
        this.resultImage = null;
        this.previewImage = null;

        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.originalImage = e.target.result;
            this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
    }

    async applyBlur(): Promise<void> {
        if (!this.originalImage) return;
        this.isProcessing = true;

        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            const img = await this.loadImageElement(this.originalImage);
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            switch (this.blurType) {
                case 'gaussian':
                    this.applyGaussianBlur(ctx, canvas);
                    break;
                case 'motion':
                    this.applyMotionBlur(ctx, canvas);
                    break;
                case 'radial':
                    this.applyRadialBlur(ctx, canvas, img);
                    break;
                case 'pixelate':
                    this.applyPixelate(ctx, canvas);
                    break;
            }

            this.resultImage = canvas.toDataURL('image/png');
            this.analyticsService.trackToolUsage('blur-image', 'Blur Image', 'image');
        } catch (error) {
            console.error('Error applying blur:', error);
            alert('Failed to apply blur effect');
        } finally {
            this.isProcessing = false;
            this.cdr.detectChanges();
        }
    }

    private applyGaussianBlur(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        // Use CSS filter for gaussian blur
        ctx.filter = `blur(${this.blurIntensity}px)`;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCanvas.getContext('2d')!.drawImage(canvas, 0, 0);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0);
        ctx.filter = 'none';
    }

    private applyMotionBlur(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const newData = new Uint8ClampedArray(data);

        const angle = this.motionAngle * Math.PI / 180;
        const distance = this.blurIntensity;
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                let r = 0, g = 0, b = 0, count = 0;

                for (let i = -distance; i <= distance; i++) {
                    const nx = Math.round(x + dx * i);
                    const ny = Math.round(y + dy * i);

                    if (nx >= 0 && nx < canvas.width && ny >= 0 && ny < canvas.height) {
                        const idx = (ny * canvas.width + nx) * 4;
                        r += data[idx];
                        g += data[idx + 1];
                        b += data[idx + 2];
                        count++;
                    }
                }

                const idx = (y * canvas.width + x) * 4;
                newData[idx] = r / count;
                newData[idx + 1] = g / count;
                newData[idx + 2] = b / count;
            }
        }

        ctx.putImageData(new ImageData(newData, canvas.width, canvas.height), 0, 0);
    }

    private applyRadialBlur(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement): void {
        // Simplified radial blur - draws multiple rotated images
        const centerX = canvas.width * this.radialCenterX / 100;
        const centerY = canvas.height * this.radialCenterY / 100;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const iterations = this.blurIntensity;
        const maxRotation = this.blurIntensity * 0.01;

        for (let i = 0; i < iterations; i++) {
            ctx.save();
            ctx.globalAlpha = 1 / iterations;
            ctx.translate(centerX, centerY);
            ctx.rotate((i - iterations / 2) * maxRotation / iterations);
            ctx.translate(-centerX, -centerY);
            ctx.drawImage(img, 0, 0);
            ctx.restore();
        }
    }

    private applyPixelate(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        const size = Math.max(1, this.pixelSize);
        const w = canvas.width;
        const h = canvas.height;

        // Scale down then back up
        ctx.imageSmoothingEnabled = false;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = h;
        tempCanvas.getContext('2d')!.drawImage(canvas, 0, 0);

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(tempCanvas, 0, 0, w / size, h / size);
        ctx.drawImage(canvas, 0, 0, w / size, h / size, 0, 0, w, h);

        ctx.imageSmoothingEnabled = true;
    }

    private loadImageElement(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    getOutputFileName(): string {
        return this.originalFileName.replace(/\.[^/.]+$/, '') + '_blurred.png';
    }

    downloadResult(): void {
        if (!this.resultImage) return;

        const link = document.createElement('a');
        link.href = this.resultImage;
        link.download = this.getOutputFileName();
        link.click();
    }

    reset(): void {
        this.originalImage = null;
        this.resultImage = null;
        this.originalFileName = '';
        this.previewImage = null;
    }
}
